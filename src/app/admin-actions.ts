"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signInAdmin, signOutAdmin } from "@/lib/auth";
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
import type { Notification } from "@/lib/data/types";
import type { Programme, ProgrammeAccent } from "@/lib/site";
import type { Story, StoryBlock } from "@/lib/stories";
import type { FormState } from "@/lib/validation";

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_FAILED_ATTEMPTS = 5;

const rateLimitDir = path.join(process.cwd(), "data", "rate-limit");

async function recordFailedLogin(ip: string) {
  try {
    await fs.mkdir(rateLimitDir, { recursive: true });
    const file = path.join(rateLimitDir, `${ip}.json`);
    let data: { count: number; firstAttempt: number } = { count: 0, firstAttempt: Date.now() };
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

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = text(formData, "next") || "/admin";

  // Rate limit failed logins by IP (mock mode only; Supabase handles its own)
  const forwarded = formData.get("x-forwarded-for");
  const ip = forwarded ? String(forwarded) : "unknown";
  const attempts = await recordFailedLogin(ip);
  if (attempts > MAX_FAILED_ATTEMPTS) {
    return { ok: false, message: "Too many failed attempts. Try again later." };
  }

  const result = await signInAdmin(email, password);
  if (result.error) {
    return { ok: false, message: result.error };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function setDonationStatusAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "confirmed" || status === "cancelled" || status === "pending") {
    await setDonationStatus(id, status);
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
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "new" || status === "reviewed" || status === "archived") {
    await setSubmissionStatus("contacts", id, status);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function setVolunteerStatusAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "new" || status === "reviewed" || status === "archived") {
    await setSubmissionStatus("volunteers", id, status);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/volunteers");
}

export async function setPartnershipStatusAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id) return;
  if (status === "new" || status === "reviewed" || status === "archived") {
    await setSubmissionStatus("partnerships", id, status);
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

function parseBlocks(body: string): StoryBlock[] {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("## ")) {
        return { type: "h2", text: chunk.slice(3).trim() } as StoryBlock;
      }
      if (chunk.startsWith("> ")) {
        return { type: "quote", text: chunk.slice(2).trim() } as StoryBlock;
      }
      return { type: "p", text: chunk.replace(/\n/g, " ") } as StoryBlock;
    });
}

export async function saveStoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const title = text(formData, "title");
  if (title.length < 3) {
    return { ok: false, message: "Please enter a story title." };
  }

  const body = text(formData, "body");
  if (!body) {
    return { ok: false, message: "Please enter the story body." };
  }

  const excerpt = text(formData, "excerpt");
  if (!excerpt) {
    return { ok: false, message: "Please enter a story excerpt." };
  }

  const slug = text(formData, "slug") || slugify(title);
  const existingSlug = text(formData, "existingSlug");
  const programmes = text(formData, "programmes")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const status = (text(formData, "status") || "published") as "draft" | "published";

  // Duplicate-slug guard: prevent overwriting a different story's slug
  if (!existingSlug) {
    const { getAdminStory } = await import("@/lib/data/content");
    const existing = await getAdminStory(slug);
    if (existing) {
      return { ok: false, message: "A story with this slug already exists." };
    }
  }

  const story: Story = {
    slug,
    title,
    category: text(formData, "category") || "Community",
    location: text(formData, "location") || "Ahafo Region",
    date: text(formData, "date") || new Date().toLocaleDateString("en-CA"),
    readTime: text(formData, "readTime") || "3 min read",
    image: text(formData, "image") || "/images/hero-community.jpg",
    imageAlt: text(formData, "imageAlt") || title,
    excerpt: text(formData, "excerpt"),
    blocks: parseBlocks(body),
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
  revalidatePath("/");
  revalidatePath("/stories");
  redirect("/admin/stories");
}

export async function deleteStoryAction(formData: FormData) {
  await requireAdmin();
  const slug = text(formData, "slug");
  if (slug) await deleteAdminStory(slug);
  revalidatePath("/admin/stories");
  revalidatePath("/");
  revalidatePath("/stories");
}

export async function saveProgrammeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
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

  // Duplicate-slug guard: prevent overwriting a different programme's slug
  if (!existingSlug) {
    const { getAdminProgramme } = await import("@/lib/data/content");
    const existing = await getAdminProgramme(slug);
    if (existing) {
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

export async function deleteProgrammeAction(formData: FormData) {
  await requireAdmin();
  const slug = text(formData, "slug");
  if (slug) {
    const { deleteAdminProgramme } = await import("@/lib/data/content");
    await deleteAdminProgramme(slug);
  }
  revalidatePath("/admin/programmes");
  revalidatePath("/");
  revalidatePath("/programmes");
}

export async function saveNotificationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const slug = text(formData, "slug");
  if (!slug) return { ok: false, message: "Missing notification slug." };

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

export async function saveSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
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
  };

  try {
    await saveSiteSettings(patch);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save settings.";
    return { ok: false, message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
