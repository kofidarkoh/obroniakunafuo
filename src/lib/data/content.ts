import { org, programmes as seedProgrammes, type Programme } from "@/lib/site";
import { stories as seedStories, type Story } from "@/lib/stories";
import { readJson, updateJson } from "@/lib/data/json-db";
import type { Notification, GalleryItem } from "@/lib/data/types";
import {
  createSupabaseServiceClient,
  supabaseConfigured,
} from "@/lib/supabase/server";

export type SiteSettings = {
  email: string;
  phonePrimary: string;
  phoneSecondary: string;
  address: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  momoNumber: string;
  momoName: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  adminEmail: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  googleSiteVerification: string;
};

export type OrgContact = {
  name: string;
  regNo: string;
  tin: string;
  email: string;
  phones: string[];
  phoneLinks: string[];
  addressFull: string;
  socials: {
    label: string;
    href: string;
    icon: "facebook" | "instagram" | "linkedin" | "whatsapp";
  }[];
};

const files = {
  stories: "stories.json",
  programmes: "programmes.json",
  settings: "settings.json",
  notifications: "notifications.json",
  gallery: "gallery.json",
} as const;

function seedStoriesValue() {
  return structuredClone(seedStories);
}

function seedProgrammesValue() {
  return structuredClone(seedProgrammes);
}

function seedSettings(): SiteSettings {
  return {
    email: org.email,
    phonePrimary: org.phones[0],
    phoneSecondary: org.phones[1],
    address: org.addressFull,
    bankName: org.bank.name,
    bankAccountName: org.bank.accountName,
    bankAccountNumber: org.bank.accountNumber,
    momoNumber: org.momo.number,
    momoName: org.momo.accountName,
    facebook: "",
    instagram: "",
    linkedin: "",
    whatsapp: "https://wa.me/233541597436",
    adminEmail: org.email,
    seoTitle: `${org.name} — Restoring hope, dignity and love`,
    seoDescription:
      "Obroni Akunafo Kuo is a registered Ghanaian NGO supporting widows, orphans, persons with disabilities and the aged in the Ahafo Region through food relief, education, healthcare and empowerment.",
    ogImage: "/images/hero-community.jpg",
    googleSiteVerification: "",
  };
}

/* =========================================================================
   JSON implementations (local development fallback)
   ========================================================================= */

async function listAdminStoriesJson() {
  const stories = await readJson<Story[]>(files.stories, seedStoriesValue);
  return stories
    .map(normalizeStoryStatus)
    .sort((a, b) => b.date.localeCompare(a.date));
}

async function getAdminStoryJson(slug: string) {
  const stories = await readJson<Story[]>(files.stories, seedStoriesValue);
  const story = stories.find((item) => item.slug === slug);
  return story ? normalizeStoryStatus(story) : story;
}

/**
 * Stories saved before the draft/published workflow was added have no status
 * field. They were all intended to be live, so treat them as published rather
 * than silently hiding them from the public site.
 */
function normalizeStoryStatus(story: Story): Story {
  return { ...story, status: story.status ?? "published" };
}

async function upsertStoryJson(story: Story) {
  await updateJson<Story[]>(files.stories, seedStoriesValue, (stories) => {
    const index = stories.findIndex((item) => item.slug === story.slug);
    if (index >= 0) stories[index] = story;
    else stories.unshift(story);
  });
  return story;
}

async function deleteAdminStoryJson(slug: string) {
  let removed = false;
  await updateJson<Story[]>(files.stories, seedStoriesValue, (stories) => {
    const index = stories.findIndex((item) => item.slug === slug);
    if (index < 0) return;
    stories.splice(index, 1);
    removed = true;
  });
  return removed;
}

async function deleteAdminProgrammeJson(slug: string) {
  let removed = false;
  await updateJson<Programme[]>(
    files.programmes,
    seedProgrammesValue,
    (programmes) => {
      const index = programmes.findIndex((item) => item.slug === slug);
      if (index < 0) return;
      programmes.splice(index, 1);
      removed = true;
    },
  );
  return removed;
}

async function listAdminProgrammesJson() {
  const programmes = await readJson<Programme[]>(
    files.programmes,
    seedProgrammesValue,
  );
  return programmes
    .map(normalizeProgramme)
    .sort((a, b) => a.title.localeCompare(b.title));
}

async function getAdminProgrammeJson(slug: string) {
  const programmes = await readJson<Programme[]>(
    files.programmes,
    seedProgrammesValue,
  );
  const programme = programmes.find((item) => item.slug === slug);
  return programme ? normalizeProgramme(programme) : programme;
}

/** Older programme records predate the image alt text field. */
function normalizeProgramme(programme: Programme): Programme {
  return {
    ...programme,
    imageAlt: programme.imageAlt ?? programme.title,
  };
}

async function upsertProgrammeJson(programme: Programme) {
  await updateJson<Programme[]>(
    files.programmes,
    seedProgrammesValue,
    (programmes) => {
      const index = programmes.findIndex(
        (item) => item.slug === programme.slug,
      );
      if (index >= 0) programmes[index] = programme;
      else programmes.push(programme);
    },
  );
  return programme;
}

async function getSiteSettingsJson() {
  const settings = await readJson<SiteSettings>(
    files.settings,
    seedSettings,
  );
  return { ...settings };
}

async function saveSiteSettingsJson(patch: Partial<SiteSettings>) {
  let saved = seedSettings();
  await updateJson<SiteSettings>(files.settings, seedSettings, (settings) => {
    saved = { ...settings, ...patch };
    return saved;
  });
  return { ...saved };
}

function seedNotifications(): Notification[] {
  return [];
}

function seedGallery(): GalleryItem[] {
  return [];
}

/* =========================================================================
   JSON implementations (local development fallback) - notifications
   ========================================================================= */

async function listAdminNotificationsJson() {
  const items = await readJson<Notification[]>(
    files.notifications,
    seedNotifications,
  );
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

async function getAdminNotificationJson(slug: string) {
  const items = await readJson<Notification[]>(
    files.notifications,
    seedNotifications,
  );
  return items.find((item) => item.slug === slug);
}

async function upsertNotificationJson(notification: Notification) {
  await updateJson<Notification[]>(
    files.notifications,
    seedNotifications,
    (items) => {
      const index = items.findIndex((item) => item.slug === notification.slug);
      if (index >= 0) items[index] = notification;
      else items.unshift(notification);
    },
  );
  return notification;
}

async function deleteAdminNotificationJson(slug: string) {
  let removed = false;
  await updateJson<Notification[]>(
    files.notifications,
    seedNotifications,
    (items) => {
      const index = items.findIndex((item) => item.slug === slug);
      if (index < 0) return;
      items.splice(index, 1);
      removed = true;
    },
  );
  return removed;
}

/* =========================================================================
   JSON implementations (local development fallback) - gallery
   ========================================================================= */

async function listAdminGalleryJson() {
  const items = await readJson<GalleryItem[]>(files.gallery, seedGallery);
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function getAdminGalleryJson(slug: string) {
  const items = await readJson<GalleryItem[]>(files.gallery, seedGallery);
  return items.find((item) => item.slug === slug);
}

async function upsertGalleryJson(item: GalleryItem) {
  await updateJson<GalleryItem[]>(files.gallery, seedGallery, (items) => {
    const index = items.findIndex((entry) => entry.slug === item.slug);
    if (index >= 0) items[index] = item;
    else items.unshift(item);
  });
  return item;
}

async function deleteAdminGalleryJson(slug: string) {
  let removed = false;
  await updateJson<GalleryItem[]>(files.gallery, seedGallery, (items) => {
    const index = items.findIndex((entry) => entry.slug === slug);
    if (index < 0) return;
    items.splice(index, 1);
    removed = true;
  });
  return removed;
}

async function listAdminGalleryPaginatedJson(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const items = await readJson<GalleryItem[]>(files.gallery, seedGallery);
  let filtered = items;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q),
    );
  }
  const counts = tallyStatusesLocal(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

/* =========================================================================
   Paginated, searchable listing helpers (JSON fallback)
   ========================================================================= */

function tallyStatusesLocal(rows: Array<{ status?: string | null }> | null) {
  const counts: Record<string, number> = { all: rows?.length ?? 0 };
  for (const row of rows ?? []) {
    if (row.status) counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

async function listAdminStoriesPaginatedJson(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const items = await readJson<Story[]>(files.stories, seedStoriesValue);
  const normalized = items.map(normalizeStoryStatus);
  let filtered = normalized;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = normalized.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q),
    );
  }
  const counts = tallyStatusesLocal(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

async function listAdminNotificationsPaginatedJson(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const items = await readJson<Notification[]>(files.notifications, seedNotifications);
  let filtered = items;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q),
    );
  }
  const counts = tallyStatusesLocal(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

async function listAdminProgrammesPaginatedJson(args: {
  page: number;
  pageSize: number;
  search?: string;
  visibility?: string;
}) {
  const items = await readJson<Programme[]>(files.programmes, seedProgrammesValue);
  const normalized = items.map(normalizeProgramme);
  let filtered = normalized;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = normalized.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q),
    );
  }
  const counts = {
    all: filtered.length,
    featured: filtered.filter((item) => item.featuredOnHome).length,
    hidden: filtered.filter((item) => !item.featuredOnHome).length,
  };
  if (args.visibility && args.visibility !== "all") {
    if (args.visibility === "featured") {
      filtered = filtered.filter((item) => item.featuredOnHome);
    } else if (args.visibility === "hidden") {
      filtered = filtered.filter((item) => !item.featuredOnHome);
    }
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

/* =========================================================================
   Supabase implementations (production)
   ========================================================================= */

async function getSupabase() {
  if (!supabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  return createSupabaseServiceClient();
}

async function listAdminStoriesSupabase(): Promise<Story[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location,
    date: row.date,
    readTime: row.read_time,
    image: row.image,
    imageAlt: row.image_alt ?? row.title,
    excerpt: row.excerpt,
    blocks: row.blocks ?? [],
    pullQuote: {
      text: row.pull_quote_text,
      attribution: row.pull_quote_attribution,
    },
    programmes: row.programmes ?? [],
    status: row.status ?? "published",
  }));
}

async function getAdminStorySupabase(slug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    location: data.location,
    date: data.date,
    readTime: data.read_time,
    image: data.image,
    imageAlt: data.image_alt ?? data.title,
    excerpt: data.excerpt,
    blocks: data.blocks ?? [],
    pullQuote: {
      text: data.pull_quote_text,
      attribution: data.pull_quote_attribution,
    },
    programmes: data.programmes ?? [],
    status: data.status ?? "published",
  };
}

async function upsertStorySupabase(story: Story) {
  const supabase = await getSupabase();
  const record = {
    slug: story.slug,
    title: story.title,
    category: story.category,
    location: story.location,
    date: story.date,
    read_time: story.readTime,
    image: story.image,
    image_alt: story.imageAlt,
    excerpt: story.excerpt,
    blocks: story.blocks,
    pull_quote_text: story.pullQuote.text,
    pull_quote_attribution: story.pullQuote.attribution,
    programmes: story.programmes,
    status: story.status,
  };
  const { error } = await supabase
    .from("stories")
    .upsert(record, { onConflict: "slug" });
  if (error) throw error;
  return story;
}

async function deleteAdminStorySupabase(slug: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from("stories").delete().eq("slug", slug);
  if (error) throw error;
  return true;
}

async function deleteAdminProgrammeSupabase(slug: string) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("programmes")
    .delete()
    .eq("slug", slug);
  if (error) throw error;
  return true;
}

async function listAdminProgrammesSupabase(): Promise<Programme[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title,
    category: row.category,
    accent: row.accent,
    icon: row.icon,
    summary: row.summary,
    description: row.description,
    bullets: row.bullets ?? [],
    cta: row.cta,
    meta: row.meta,
    image: row.image,
    imageAlt: row.image_alt ?? row.title,
    featuredOnHome: row.featured_on_home,
    showOnProgrammes: row.show_on_programmes,
  }));
}

async function getAdminProgrammeSupabase(slug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("programmes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    shortTitle: data.short_title,
    category: data.category,
    accent: data.accent,
    icon: data.icon,
    summary: data.summary,
    description: data.description,
    bullets: data.bullets ?? [],
    cta: data.cta,
    meta: data.meta,
    image: data.image,
    imageAlt: data.image_alt ?? data.title,
    featuredOnHome: data.featured_on_home,
    showOnProgrammes: data.show_on_programmes,
  };
}

async function upsertProgrammeSupabase(programme: Programme) {
  const supabase = await getSupabase();
  const record = {
    slug: programme.slug,
    title: programme.title,
    short_title: programme.shortTitle,
    category: programme.category,
    accent: programme.accent,
    icon: programme.icon,
    summary: programme.summary,
    description: programme.description,
    bullets: programme.bullets,
    cta: programme.cta,
    meta: programme.meta,
    image: programme.image,
    image_alt: programme.imageAlt,
    featured_on_home: programme.featuredOnHome,
    show_on_programmes: programme.showOnProgrammes,
  };
  const { error } = await supabase
    .from("programmes")
    .upsert(record, { onConflict: "slug" });
  if (error) throw error;
  return programme;
}

async function getSiteSettingsSupabase(): Promise<SiteSettings> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;
  const kv = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  return {
    email: kv.email ?? org.email,
    phonePrimary: kv.phonePrimary ?? org.phones[0],
    phoneSecondary: kv.phoneSecondary ?? org.phones[1],
    address: kv.address ?? org.addressFull,
    bankName: kv.bankName ?? org.bank.name,
    bankAccountName: kv.bankAccountName ?? org.bank.accountName,
    bankAccountNumber: kv.bankAccountNumber ?? org.bank.accountNumber,
    momoNumber: kv.momoNumber ?? org.momo.number,
    momoName: kv.momoName ?? org.momo.accountName,
    facebook: kv.facebook ?? "https://facebook.com",
    instagram: kv.instagram ?? "https://instagram.com",
    linkedin: kv.linkedin ?? "https://linkedin.com",
    whatsapp: kv.whatsapp ?? "https://wa.me/233541597436",
    adminEmail: kv.adminEmail ?? org.email,
    seoTitle:
      kv.seoTitle ?? `${org.name} — Restoring hope, dignity and love`,
    seoDescription:
      kv.seoDescription ??
      "Obroni Akunafo Kuo is a registered Ghanaian NGO supporting widows, orphans, persons with disabilities and the aged in the Ahafo Region through food relief, education, healthcare and empowerment.",
    ogImage: kv.ogImage ?? "/images/hero-community.jpg",
    googleSiteVerification: kv.googleSiteVerification ?? "",
  };
}

async function saveSiteSettingsSupabase(patch: Partial<SiteSettings>) {
  const supabase = await getSupabase();
  const entries = Object.entries(patch).map(([key, value]) => ({
    key,
    value: String(value),
    updated_at: now(),
  }));
  const { error } = await supabase
    .from("settings")
    .upsert(entries, { onConflict: "key" });
  if (error) throw error;
  const current = await getSiteSettingsSupabase();
  return { ...current, ...patch };
}

/* =========================================================================
   Supabase implementations (production) - notifications
   ========================================================================= */

async function listAdminNotificationsSupabase(): Promise<Notification[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    date: row.date,
    status: row.status,
    createdAt: row.created_at,
  }));
}

async function getAdminNotificationSupabase(slug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    content: data.content,
    date: data.date,
    status: data.status,
    createdAt: data.created_at,
  };
}

async function upsertNotificationSupabase(notification: Notification) {
  const supabase = await getSupabase();
  const record = {
    slug: notification.slug,
    title: notification.title,
    summary: notification.summary,
    content: notification.content,
    date: notification.date,
    status: notification.status,
  };
  const { error } = await supabase
    .from("notifications")
    .upsert(record, { onConflict: "slug" });
  if (error) throw error;
  return notification;
}

async function deleteAdminNotificationSupabase(slug: string) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("slug", slug);
  if (error) throw error;
  return true;
}

/* =========================================================================
   Supabase implementations (production) - gallery
   ========================================================================= */

async function listAdminGallerySupabase(): Promise<GalleryItem[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    slug: row.slug,
    title: row.title,
    image: row.image,
    imageAlt: row.image_alt ?? row.title,
    caption: row.caption ?? "",
    category: row.category ?? "",
    status: row.status ?? "published",
    createdAt: row.created_at,
  }));
}

async function getAdminGallerySupabase(slug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    image: data.image,
    imageAlt: data.image_alt ?? data.title,
    caption: data.caption ?? "",
    category: data.category ?? "",
    status: data.status ?? "published",
    createdAt: data.created_at,
  };
}

async function upsertGallerySupabase(item: GalleryItem) {
  const supabase = await getSupabase();
  const record = {
    slug: item.slug,
    title: item.title,
    image: item.image,
    image_alt: item.imageAlt,
    caption: item.caption,
    category: item.category,
    status: item.status,
  };
  const { error } = await supabase
    .from("gallery")
    .upsert(record, { onConflict: "slug" });
  if (error) throw error;
  return item;
}

async function deleteAdminGallerySupabase(slug: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from("gallery").delete().eq("slug", slug);
  if (error) throw error;
  return true;
}

async function listAdminGalleryPaginatedSupabase(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("gallery").select("*", { count: "exact" });
  let statusQuery = supabase.from("gallery").select("status");

  if (args.search) {
    const q = `%${args.search}%`;
    const filter = `title.ilike.${q},slug.ilike.${q},caption.ilike.${q},category.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  if (args.status && args.status !== "all") {
    query = query.eq("status", args.status);
  }

  const from = (args.page - 1) * args.pageSize;
  const to = from + args.pageSize - 1;
  query = query.order("created_at", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    counts: tallyStatusesLocal(statusRows as Array<{ status?: string | null }>),
    items: (data ?? []).map((row) => ({
      slug: row.slug,
      title: row.title,
      image: row.image,
      imageAlt: row.image_alt ?? row.title,
      caption: row.caption ?? "",
      category: row.category ?? "",
      status: row.status ?? "published",
      createdAt: row.created_at,
    })),
    total: count ?? 0,
    page: args.page,
    pageSize: args.pageSize,
  };
}

/* =========================================================================
   Paginated, searchable listing helpers (Supabase)
   ========================================================================= */

async function listAdminStoriesPaginatedSupabase(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("stories").select("*", { count: "exact" });
  let statusQuery = supabase.from("stories").select("status");

  if (args.search) {
    const q = `%${args.search}%`;
    const filter = `title.ilike.${q},slug.ilike.${q},category.ilike.${q},location.ilike.${q},excerpt.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  if (args.status && args.status !== "all") {
    query = query.eq("status", args.status);
  }

  const from = (args.page - 1) * args.pageSize;
  const to = from + args.pageSize - 1;
  query = query.order("date", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    counts: tallyStatusesLocal(statusRows as Array<{ status?: string | null }>),
    items: (data ?? []).map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
      location: row.location,
      date: row.date,
      readTime: row.read_time,
      image: row.image,
      imageAlt: row.image_alt ?? row.title,
      excerpt: row.excerpt,
      blocks: row.blocks ?? [],
      pullQuote: {
        text: row.pull_quote_text,
        attribution: row.pull_quote_attribution,
      },
      programmes: row.programmes ?? [],
      status: row.status ?? "published",
    })),
    total: count ?? 0,
    page: args.page,
    pageSize: args.pageSize,
  };
}

async function listAdminNotificationsPaginatedSupabase(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("notifications").select("*", { count: "exact" });
  let statusQuery = supabase.from("notifications").select("status");

  if (args.search) {
    const q = `%${args.search}%`;
    const filter = `title.ilike.${q},slug.ilike.${q},summary.ilike.${q},content.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  if (args.status && args.status !== "all") {
    query = query.eq("status", args.status);
  }

  const from = (args.page - 1) * args.pageSize;
  const to = from + args.pageSize - 1;
  query = query.order("date", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    counts: tallyStatusesLocal(statusRows as Array<{ status?: string | null }>),
    items: (data ?? []).map((row) => ({
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      status: row.status,
      createdAt: row.created_at,
    })),
    total: count ?? 0,
    page: args.page,
    pageSize: args.pageSize,
  };
}

async function listAdminProgrammesPaginatedSupabase(args: {
  page: number;
  pageSize: number;
  search?: string;
  visibility?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("programmes").select("*", { count: "exact" });
  let visQuery = supabase.from("programmes").select("featured_on_home");

  if (args.search) {
    const q = `%${args.search}%`;
    const filter = `title.ilike.${q},slug.ilike.${q},category.ilike.${q},summary.ilike.${q}`;
    query = query.or(filter);
    visQuery = visQuery.or(filter);
  }

  const from = (args.page - 1) * args.pageSize;
  const to = from + args.pageSize - 1;

  // fetch all filtered for counts + visibility filter
  const { data: allRows, error: allErr } = await visQuery;
  if (allErr) throw allErr;
  const counts = {
    all: allRows?.length ?? 0,
    featured: (allRows ?? []).filter((r) => r.featured_on_home).length,
    hidden: (allRows ?? []).filter((r) => !r.featured_on_home).length,
  };

  if (args.visibility === "featured") {
    query = query.eq("featured_on_home", true);
  } else if (args.visibility === "hidden") {
    query = query.eq("featured_on_home", false);
  }

  query = query.order("title", { ascending: true }).range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;

  return {
    counts,
    items: (data ?? []).map((row) => ({
      slug: row.slug,
      title: row.title,
      shortTitle: row.short_title,
      category: row.category,
      accent: row.accent,
      icon: row.icon,
      summary: row.summary,
      description: row.description,
      bullets: row.bullets ?? [],
      cta: row.cta,
      meta: row.meta,
      image: row.image,
      imageAlt: row.image_alt ?? row.title,
      featuredOnHome: row.featured_on_home,
      showOnProgrammes: row.show_on_programmes,
    })),
    total: count ?? 0,
    page: args.page,
    pageSize: args.pageSize,
  };
}

/* =========================================================================
   Exported functions (dual implementation)
   ========================================================================= */

export async function listAdminStories() {
  if (supabaseConfigured()) {
    return listAdminStoriesSupabase();
  }
  return listAdminStoriesJson();
}

export async function getAdminStory(slug: string) {
  if (supabaseConfigured()) {
    return getAdminStorySupabase(slug);
  }
  return getAdminStoryJson(slug);
}

export async function upsertStory(story: Story) {
  if (supabaseConfigured()) {
    return upsertStorySupabase(story);
  }
  return upsertStoryJson(story);
}

export async function deleteAdminStory(slug: string) {
  if (supabaseConfigured()) {
    return deleteAdminStorySupabase(slug);
  }
  return deleteAdminStoryJson(slug);
}

export async function deleteAdminProgramme(slug: string) {
  if (supabaseConfigured()) {
    return deleteAdminProgrammeSupabase(slug);
  }
  return deleteAdminProgrammeJson(slug);
}

/** Public story list, newest first. Only published stories. */
export async function listStories() {
  const stories = await listAdminStories();
  return stories.filter((story) => story.status === "published");
}

/** Public story lookup. Returns null for drafts. */
export async function getStory(slug: string) {
  const story = await getAdminStory(slug);
  if (!story || story.status !== "published") return null;
  return story;
}

/** Public "more stories" helper. Only published stories. */
export async function getMoreStories(slug: string, limit = 3) {
  const stories = await listStories();
  return stories.filter((story) => story.slug !== slug).slice(0, limit);
}

/** Admin-only story lookup, includes drafts. */
export async function getAdminStoryIncludingDraft(slug: string) {
  return getAdminStory(slug);
}

/* ------------------------------------------------------------- programmes */

export async function listAdminProgrammes() {
  if (supabaseConfigured()) {
    return listAdminProgrammesSupabase();
  }
  return listAdminProgrammesJson();
}

export async function getAdminProgramme(slug: string) {
  if (supabaseConfigured()) {
    return getAdminProgrammeSupabase(slug);
  }
  return getAdminProgrammeJson(slug);
}

export async function upsertProgramme(programme: Programme) {
  if (supabaseConfigured()) {
    return upsertProgrammeSupabase(programme);
  }
  return upsertProgrammeJson(programme);
}

export async function listProgrammes() {
  return listAdminProgrammes();
}

export async function getProgramme(slug: string) {
  return getAdminProgramme(slug);
}

/* --------------------------------------------------------------- settings */

export async function getSiteSettings() {
  if (supabaseConfigured()) {
    return getSiteSettingsSupabase();
  }
  return getSiteSettingsJson();
}

export async function saveSiteSettings(patch: Partial<SiteSettings>) {
  if (supabaseConfigured()) {
    return saveSiteSettingsSupabase(patch);
  }
  return saveSiteSettingsJson(patch);
}

/* ------------------------------------------------------------- notifications */

export async function listAdminNotifications() {
  if (supabaseConfigured()) {
    return listAdminNotificationsSupabase();
  }
  return listAdminNotificationsJson();
}

export async function getAdminNotification(slug: string) {
  if (supabaseConfigured()) {
    return getAdminNotificationSupabase(slug);
  }
  return getAdminNotificationJson(slug);
}

export async function upsertNotification(notification: Notification) {
  if (supabaseConfigured()) {
    return upsertNotificationSupabase(notification);
  }
  return upsertNotificationJson(notification);
}

export async function deleteAdminNotification(slug: string) {
  if (supabaseConfigured()) {
    return deleteAdminNotificationSupabase(slug);
  }
  return deleteAdminNotificationJson(slug);
}

/** Public notification list, newest first. Only published notifications. */
export async function listNotifications() {
  const items = await listAdminNotifications();
  return items.filter((item) => item.status === "published");
}

/** Public notification lookup. Returns null for drafts. */
export async function getNotification(slug: string) {
  const item = await getAdminNotification(slug);
  if (!item || item.status !== "published") return null;
  return item;
}

/** Contact details shown in the public header and footer. */
export async function getOrgContact(): Promise<OrgContact> {
  const settings = await getSiteSettings();
  const phones = [settings.phonePrimary, settings.phoneSecondary].filter(
    Boolean,
  );

  return {
    name: org.name,
    regNo: org.regNo,
    tin: org.tin,
    email: settings.email,
    phones,
    phoneLinks: phones.map((phone) =>
      `+233${phone.replace(/\D/g, "").replace(/^0/, "")}`,
    ),
    addressFull: settings.address,
    socials: (
      [
        { label: "Facebook", href: settings.facebook, icon: "facebook" },
        { label: "Instagram", href: settings.instagram, icon: "instagram" },
        { label: "LinkedIn", href: settings.linkedin, icon: "linkedin" },
        { label: "WhatsApp", href: settings.whatsapp, icon: "whatsapp" },
      ] as const
    ).filter((social) => Boolean(social.href)),
  };
}

export async function listAdminStoriesPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listAdminStoriesPaginatedSupabase(args);
  }
  return listAdminStoriesPaginatedJson(args);
}

export async function listAdminNotificationsPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listAdminNotificationsPaginatedSupabase(args);
  }
  return listAdminNotificationsPaginatedJson(args);
}

export async function listAdminProgrammesPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  visibility?: string;
}) {
  if (supabaseConfigured()) {
    return listAdminProgrammesPaginatedSupabase(args);
  }
  return listAdminProgrammesPaginatedJson(args);
}

/* --------------------------------------------------------------- gallery */

export async function listAdminGallery() {
  if (supabaseConfigured()) {
    return listAdminGallerySupabase();
  }
  return listAdminGalleryJson();
}

export async function getAdminGallery(slug: string) {
  if (supabaseConfigured()) {
    return getAdminGallerySupabase(slug);
  }
  return getAdminGalleryJson(slug);
}

export async function upsertGallery(item: GalleryItem) {
  if (supabaseConfigured()) {
    return upsertGallerySupabase(item);
  }
  return upsertGalleryJson(item);
}

export async function deleteAdminGallery(slug: string) {
  if (supabaseConfigured()) {
    return deleteAdminGallerySupabase(slug);
  }
  return deleteAdminGalleryJson(slug);
}

/** Public gallery list, newest first. Only published items. */
export async function listGallery() {
  const items = await listAdminGallery();
  return items.filter((item) => item.status === "published");
}

/** Public gallery lookup. Returns null for drafts. */
export async function getGallery(slug: string) {
  const item = await getAdminGallery(slug);
  if (!item || item.status !== "published") return null;
  return item;
}

export async function listAdminGalleryPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listAdminGalleryPaginatedSupabase(args);
  }
  return listAdminGalleryPaginatedJson(args);
}

function now() {
  return new Date().toISOString();
}
