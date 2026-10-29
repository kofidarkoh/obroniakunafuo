import { org, programmes as seedProgrammes, type Programme } from "@/lib/site";
import { stories as seedStories, type Story } from "@/lib/stories";
import { readJson, updateJson } from "@/lib/data/json-db";
import type { Notification } from "@/lib/data/types";
import {
  createSupabaseServerClient,
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
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    whatsapp: "https://wa.me/233541597436",
    adminEmail: org.email,
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
    imageAlt: row.image_alt,
    excerpt: row.excerpt,
    blocks: row.blocks ?? [],
    pullQuote: {
      text: row.pull_quote_text,
      attribution: row.pull_quote_attribution,
    },
    programmes: row.programmes ?? [],
    status: row.status,
  }));
}

async function getAdminStorySupabase(slug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .single();
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
    imageAlt: data.image_alt,
    excerpt: data.excerpt,
    blocks: data.blocks ?? [],
    pullQuote: {
      text: data.pull_quote_text,
      attribution: data.pull_quote_attribution,
    },
    programmes: data.programmes ?? [],
    status: data.status,
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
    imageAlt: (row as any).image_alt ?? "",
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
    .single();
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
    imageAlt: (data as any).image_alt ?? "",
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
  return { ...getSiteSettingsSupabase(), ...patch };
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
    .single();
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

function now() {
  return new Date().toISOString();
}
