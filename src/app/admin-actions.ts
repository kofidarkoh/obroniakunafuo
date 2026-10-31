"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  requireAdmin,
  signInAdmin,
  signOutAdmin,
  requestPasswordReset,
} from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { supabaseConfigured } from "@/lib/supabase/server";
import {
  addNote,
  acknowledgeDonation,
  setDonationStatus,
  setSubmissionStatus,
} from "@/lib/data/store";
import {
  deleteAdminStory,
  saveSiteSettings,
  upsertNotification,
  upsertProgramme,
  upsertStory,
} from "@/lib/data/content";
import type { Notification, GalleryItem } from "@/lib/data/types";
import type { Programme, ProgrammeAccent } from "@/lib/site";
import type { Story } from "@/lib/stories";
import {
  estimateReadTime,
  parseStoryBlocks,
} from "@/lib/story-format";
import { slugify } from "@/lib/utils";
import type { FormState } from "@/lib/validation";

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_FAILED_ATTEMPTS = 5;

const rateLimitDir = path.join(process.cwd(), "data", "rate-limit");

async function readFailedLoginCount(ip: string) {
  try {
    const file = path.join(rateLimitDir, `${ip}.json`);
    const data = JSON.parse(await fs.readFile(file, "utf8")) as {
      count: number;
      firstAttempt: number;
    };
    const now = Date.now();
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) return 0;
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

async function recordFailedLogin(ip: string) {
  try {
    await fs.mkdir(rateLimitDir, { recursive: true });
    const file = path.join(rateLimitDir, `${ip}.json`);
    let data: { count: number; firstAttempt: number } = {
      count: 0,
      firstAttempt: Date.now(),
    };
    try {
      data = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      // file doesn't exist yet
    }
    const now = Date.now();
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      data = { count: 1, firstAttempt: now };
    } else {
      data.count += 1;
    }
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return data.count;
  } catch {
    return 0;
  }
}

function sanitizeIp(raw: string) {
  const value = raw.split(",")[0]?.trim() || "unknown";
  const safe = value.replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 64);
  return safe || "unknown";
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = text(formData, "next") || "/admin";

  const result = await signInAdmin(email, password);

  // In mock (local) mode, apply the file-based rate limiter. In Supabase mode,
  // Supabase Auth enforces its own rate limiting, so skip disk-based tracking.
  if (!supabaseConfigured()) {
    const headerStore = await headers();
    const ip = sanitizeIp(
      headerStore.get("x-forwarded-for") ||
        headerStore.get("x-real-ip") ||
        "unknown",
    );

    const attempts = await readFailedLoginCount(ip);
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      return { ok: false, message: "Too many failed attempts. Try again later." };
    }

    if (result.error) {
      await recordFailedLogin(ip);
      return { ok: false, message: result.error };
    }
  } else if (result.error) {
    return { ok: false, message: result.error };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function requestPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email");
  if (!email) {
    return { ok: false, message: "Please enter your email address." };
  }
  const result = await requestPasswordReset(email);
  if (result.error) {
    return { ok: false, message: result.error };
  }
  return {
    ok: true,
    message: "If an account exists, a reset link has been sent.",
  };
}

export async function setDonationStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "confirmed" || status === "cancelled" || status === "pending") {
    await setDonationStatus(id, status);
    await logAdminAction({
      actor: session.email,
      action: "status",
      entityType: "donation",
      entityId: id,
      after: status,
    });
    if (status === "confirmed") {
      const { getDonation } = await import("@/lib/data/store");
      const donation = await getDonation(id);
      if (donation?.email) {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail(donation.email, `Donation confirmed — ${donation.reference}`, [
          { label: "Reference", value: donation.reference },
          { label: "Donor", value: donation.donorName },
          { label: "Amount", value: `GHC ${donation.amount.toFixed(2)}` },
          { label: "Frequency", value: donation.frequency },
          { label: "Method", value: donation.method },
        ]);
      }
    }
  }
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
}

export async function acknowledgeDonationAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const author = text(formData, "author") || "Admin";
  if (!id) return;
  await acknowledgeDonation(id, author);
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
}

export async function setContactStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "new" || status === "reviewed" || status === "archived") {
    await setSubmissionStatus("contacts", id, status);
    await logAdminAction({
      actor: session.email,
      action: "status",
      entityType: "contact",
      entityId: id,
      after: status,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function setVolunteerStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "new" || status === "reviewed" || status === "archived") {
    await setSubmissionStatus("volunteers", id, status);
    await logAdminAction({
      actor: session.email,
      action: "status",
      entityType: "volunteer",
      entityId: id,
      after: status,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/volunteers");
}

export async function setPartnershipStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "new" || status === "reviewed" || status === "archived") {
    await setSubmissionStatus("partnerships", id, status);
    await logAdminAction({
      actor: session.email,
      action: "status",
      entityType: "partnership",
      entityId: id,
      after: status,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/partnerships");
}

export async function addNoteAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const collection = text(formData, "collection");
  const id = text(formData, "id");
  const author = text(formData, "author") || "Admin";
  const textValue = text(formData, "note");
  if (!collection || !id || !textValue) {
    return { ok: false, message: "Missing note details." };
  }
  if (!["contacts", "volunteers", "partnerships"].includes(collection)) {
    return { ok: false, message: "Invalid collection." };
  }
  await addNote(collection as "contacts" | "volunteers" | "partnerships", id, author, textValue);
  revalidatePath("/admin");
  return { ok: true, message: "Note added." };
}

/** Wrapper for plain form actions (no useActionState). */
export async function addNoteFormAction(formData: FormData) {
  await addNoteAction(undefined as unknown as FormState, formData);
  revalidatePath("/admin");
}

export async function saveStoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const title = text(formData, "title");
  if (title.length < 3) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: { title: ["Please enter a story title."] },
    };
  }

  const body = text(formData, "body");
  if (!body) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: { body: ["Please enter the story body."] },
    };
  }

  const excerpt = text(formData, "excerpt");
  if (!excerpt) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: { excerpt: ["Please enter a story excerpt."] },
    };
  }

  const slug = slugify(text(formData, "slug")) || slugify(title);
  if (!slug) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: { slug: ["Please enter a title or slug."] },
    };
  }

  const existingSlug = text(formData, "existingSlug");
  const programmes = formData
    .getAll("programmes")
    .map((item) => String(item).trim())
    .filter(Boolean);
  const status: Story["status"] =
    text(formData, "status") === "draft" ? "draft" : "published";

  // Duplicate-slug guard: prevent overwriting a different story's slug.
  // Renaming an existing story is allowed, but it must not take over the
  // slug of another record.
  {
    const { getAdminStory } = await import("@/lib/data/content");
    const existing = await getAdminStory(slug);
    if (existing && slug !== existingSlug) {
      return {
        ok: false,
        message: "Please check the highlighted fields.",
        errors: { slug: ["A story with this slug already exists."] },
      };
    }
  }

  const blocks = parseStoryBlocks(body);
  const story: Story = {
    slug,
    title,
    category: text(formData, "category") || "Community",
    location: text(formData, "location") || "Ahafo Region",
    date: text(formData, "date") || new Date().toISOString().slice(0, 10),
    readTime: estimateReadTime(body),
    image: text(formData, "image") || "/images/hero-community.jpg",
    imageAlt: text(formData, "imageAlt") || title,
    excerpt: text(formData, "excerpt"),
    blocks,
    pullQuote: {
      text: text(formData, "pullQuote"),
      attribution:
        text(formData, "pullQuoteAttribution") ||
        "Obroni Akunafo Kuo",
    },
    programmes,
    status,
  };

  try {
    await upsertStory(story);
    await logAdminAction({
      actor: session.email,
      action: "upsert",
      entityType: "story",
      entityId: slug,
      after: title,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save story.";
    return { ok: false, message };
  }

  // Only delete the old record after the new one is safely saved.
  if (existingSlug && existingSlug !== slug) {
    await deleteAdminStory(existingSlug);
  }

  revalidatePath("/admin/stories");
  revalidatePath(`/admin/stories/${slug}`);
  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${slug}`);
  redirect(`/admin/stories/${slug}?saved=1`);
}

export async function deleteStoryAction(formData: FormData) {
  const session = await requireAdmin();
  const slug = text(formData, "slug");
  if (slug) {
    await deleteAdminStory(slug);
    await logAdminAction({
      actor: session.email,
      action: "delete",
      entityType: "story",
      entityId: slug,
    });
  }
  revalidatePath("/admin/stories");
  revalidatePath("/");
  revalidatePath("/stories");
}

export async function saveProgrammeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const title = text(formData, "title");
  if (title.length < 3) {
    return { ok: false, message: "Please enter a programme title." };
  }

  const summary = text(formData, "summary");
  if (!summary) {
    return { ok: false, message: "Please enter a programme summary." };
  }

  const description = text(formData, "description");
  if (!description) {
    return { ok: false, message: "Please enter a programme description." };
  }

  const slug = text(formData, "slug") || slugify(title);
  if (!slug) return { ok: false, message: "Missing programme slug." };

  const existingSlug = text(formData, "existingSlug");

  // Duplicate-slug guard: prevent overwriting a different programme's slug.
  // Renaming an existing programme is allowed, but it must not take over the
  // slug of another record.
  {
    const { getAdminProgramme } = await import("@/lib/data/content");
    const existing = await getAdminProgramme(slug);
    if (existing && slug !== existingSlug) {
      return { ok: false, message: "A programme with this slug already exists." };
    }
  }

  const programme: Programme = {
    slug,
    title,
    shortTitle: text(formData, "shortTitle") || title,
    category: text(formData, "category") || "Food Support",
    accent: (text(formData, "accent") || "green") as ProgrammeAccent,
    icon: (text(formData, "icon") || "utensils") as Programme["icon"],
    summary,
    description,
    bullets: text(formData, "bullets")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    cta: text(formData, "cta") || "Support this programme",
    meta: text(formData, "meta"),
    image: text(formData, "image") || "/images/programmes/food.jpg",
    imageAlt: text(formData, "imageAlt") || title,
    featuredOnHome: formData.get("featuredOnHome") === "on",
    showOnProgrammes: formData.get("showOnProgrammes") === "on",
  };

  try {
    await upsertProgramme(programme);
    await logAdminAction({
      actor: session.email,
      action: "upsert",
      entityType: "programme",
      entityId: slug,
      after: title,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save programme.";
    return { ok: false, message };
  }

  // Only delete the old record after the new one is safely saved.
  if (existingSlug && existingSlug !== slug) {
    const { deleteAdminProgramme } = await import("@/lib/data/content");
    await deleteAdminProgramme(existingSlug);
  }

  revalidatePath("/admin/programmes");
  revalidatePath("/");
  revalidatePath("/programmes");
  redirect("/admin/programmes");
}

export async function deleteDonationAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id") || text(formData, "slug");
  if (!id) return;
  const { deleteDonation } = await import("@/lib/data/store");
  await deleteDonation(id);
  const { logAdminAction } = await import("@/lib/audit");
  await logAdminAction({
    actor: session.email,
    action: "delete",
    entityType: "donation",
    entityId: id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
}

export async function deleteContactAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id") || text(formData, "slug");
  if (!id) return;
  const { deleteSubmission } = await import("@/lib/data/store");
  await deleteSubmission("contacts", id);
  const { logAdminAction } = await import("@/lib/audit");
  await logAdminAction({
    actor: session.email,
    action: "delete",
    entityType: "contact",
    entityId: id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function deleteVolunteerAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id") || text(formData, "slug");
  if (!id) return;
  const { deleteSubmission } = await import("@/lib/data/store");
  await deleteSubmission("volunteers", id);
  const { logAdminAction } = await import("@/lib/audit");
  await logAdminAction({
    actor: session.email,
    action: "delete",
    entityType: "volunteer",
    entityId: id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/volunteers");
}

export async function deletePartnershipAction(formData: FormData) {
  const session = await requireAdmin();
  const id = text(formData, "id") || text(formData, "slug");
  if (!id) return;
  const { deleteSubmission } = await import("@/lib/data/store");
  await deleteSubmission("partnerships", id);
  const { logAdminAction } = await import("@/lib/audit");
  await logAdminAction({
    actor: session.email,
    action: "delete",
    entityType: "partnership",
    entityId: id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/partnerships");
}

export async function deleteProgrammeAction(formData: FormData) {
  const session = await requireAdmin();
  const slug = text(formData, "slug");
  if (slug) {
    const { deleteAdminProgramme } = await import("@/lib/data/content");
    await deleteAdminProgramme(slug);
    await logAdminAction({
      actor: session.email,
      action: "delete",
      entityType: "programme",
      entityId: slug,
    });
  }
  revalidatePath("/admin/programmes");
  revalidatePath("/");
  revalidatePath("/programmes");
}

export async function saveNotificationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const slug = text(formData, "slug");
  if (!slug) return { ok: false, message: "Missing notification slug." };

  const existingSlug = text(formData, "existingSlug");

  // Duplicate-slug guard: prevent overwriting a different notification's slug.
  if (slug !== existingSlug) {
    const { getAdminNotification } = await import("@/lib/data/content");
    const existing = await getAdminNotification(slug);
    if (existing) {
      return { ok: false, message: "A notification with this slug already exists." };
    }
  }

  const title = text(formData, "title");
  if (title.length < 3) {
    return { ok: false, message: "Please enter a notification title." };
  }

  const summary = text(formData, "summary");
  if (!summary) {
    return { ok: false, message: "Please enter a summary." };
  }

  const content = text(formData, "content");
  if (!content) {
    return { ok: false, message: "Please enter the announcement content." };
  }

  const date = text(formData, "date");
  if (!date) {
    return { ok: false, message: "Missing date." };
  }

  const status = (formData.get("status") || "draft") as
    | "draft"
    | "published";

  const notification: Notification = {
    slug,
    title,
    summary,
    content,
    date,
    status,
    createdAt: new Date().toISOString(),
  };

  try {
    await upsertNotification(notification);
    await logAdminAction({
      actor: session.email,
      action: "upsert",
      entityType: "notification",
      entityId: slug,
      after: title,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save notification.";
    return { ok: false, message };
  }

  revalidatePath("/admin/notifications");
  revalidatePath("/");
  revalidatePath("/notifications");
  redirect("/admin/notifications");
}

export async function saveGalleryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const slug = text(formData, "slug");
  if (!slug) return { ok: false, message: "Missing gallery slug." };

  const existingSlug = text(formData, "existingSlug");

  if (slug !== existingSlug) {
    const { getAdminGallery } = await import("@/lib/data/content");
    const existing = await getAdminGallery(slug);
    if (existing) {
      return { ok: false, message: "A gallery item with this slug already exists." };
    }
  }

  const title = text(formData, "title");
  if (title.length < 3) {
    return { ok: false, message: "Please enter a title." };
  }

  const image = text(formData, "image");
  if (!image) {
    return { ok: false, message: "Please provide an image." };
  }

  const imageAlt = text(formData, "imageAlt");
  const caption = text(formData, "caption");
  const category = text(formData, "category");

  const status = (formData.get("status") || "draft") as "draft" | "published";

  const item: GalleryItem = {
    slug,
    title,
    image,
    imageAlt: imageAlt || title,
    caption,
    category,
    status,
    createdAt: new Date().toISOString(),
  };

  try {
    const { upsertGallery } = await import("@/lib/data/content");
    await upsertGallery(item);
    const { logAdminAction } = await import("@/lib/audit");
    await logAdminAction({
      actor: session.email,
      action: "upsert",
      entityType: "gallery",
      entityId: slug,
      after: title,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save gallery item.";
    return { ok: false, message };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function saveSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const patch = {
    email: text(formData, "email"),
    phonePrimary: text(formData, "phonePrimary"),
    phoneSecondary: text(formData, "phoneSecondary"),
    address: text(formData, "address"),
    bankName: text(formData, "bankName"),
    bankAccountName: text(formData, "bankAccountName"),
    bankAccountNumber: text(formData, "bankAccountNumber"),
    momoNumber: text(formData, "momoNumber"),
    momoName: text(formData, "momoName"),
    facebook: text(formData, "facebook"),
    instagram: text(formData, "instagram"),
    linkedin: text(formData, "linkedin"),
    whatsapp: text(formData, "whatsapp"),
    adminEmail: text(formData, "adminEmail"),
    seoTitle: text(formData, "seoTitle"),
    seoDescription: text(formData, "seoDescription"),
    ogImage: text(formData, "ogImage"),
    googleSiteVerification: text(formData, "googleSiteVerification"),
  };

  try {
    await saveSiteSettings(patch);
    await logAdminAction({
      actor: session.email,
      action: "update",
      entityType: "settings",
      entityId: "site",
      after: "updated",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save settings.";
    return { ok: false, message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
