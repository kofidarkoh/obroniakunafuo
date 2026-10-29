import { createClient } from "@supabase/supabase-js";
import * as fs from "node:fs";
import path from "node:path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const dataDir = path.join(process.cwd(), "data", "db");

async function readJson<T>(file: string): Promise<T[]> {
  const raw = await fs.promises.readFile(path.join(dataDir, file), "utf8");
  return JSON.parse(raw);
}

async function migrate() {
  let count = 0;

  // === Stories ===
  const stories = await readJson<any>("stories.json");
  for (const s of stories) {
    await supabase.from("stories").upsert(
      {
        slug: s.slug,
        title: s.title,
        category: s.category,
        location: s.location,
        date: s.date,
        read_time: s.readTime,
        image: s.image,
        image_alt: s.imageAlt,
        excerpt: s.excerpt,
        blocks: s.blocks,
        pull_quote_text: s.pullQuote.text,
        pull_quote_attribution: s.pullQuote.attribution,
        programmes: s.programmes,
        status: s.status,
      },
      { onConflict: "slug" },
    );
    count++;
  }
  console.log(`Stories: ${stories.length}`);

  // === Programmes ===
  const programmes = await readJson<any>("programmes.json");
  for (const p of programmes) {
    await supabase.from("programmes").upsert(
      {
        slug: p.slug,
        title: p.title,
        short_title: p.shortTitle,
        category: p.category,
        accent: p.accent,
        icon: p.icon,
        summary: p.summary,
        description: p.description,
        bullets: p.bullets,
        cta: p.cta,
        meta: p.meta,
        image: p.image,
        featured_on_home: p.featuredOnHome,
        show_on_programmes: p.showOnProgrammes,
      },
      { onConflict: "slug" },
    );
    count++;
  }
  console.log(`Programmes: ${programmes.length}`);

  // === Settings ===
  const settings = await readJson<any>("settings.json");
  for (const [key, value] of Object.entries(settings)) {
    await supabase.from("settings").upsert(
      { key, value: String(value) },
      { onConflict: "key" },
    );
    count++;
  }
  console.log(`Settings: ${Object.keys(settings).length}`);

  // === Donations ===
  const donations = await readJson<any>("donations.json");
  for (const d of donations) {
    await supabase.from("donations").upsert(
      {
        id: d.id,
        donor_name: d.donorName,
        email: d.email,
        phone: d.phone,
        amount: d.amount,
        frequency: d.frequency,
        method: d.method,
        reference: d.reference,
        message: d.message,
        status: d.status,
        created_at: d.createdAt,
        confirmed_at: d.confirmedAt,
        acknowledged_at: d.acknowledgedAt,
        acknowledged_by: d.acknowledgedBy,
      },
      { onConflict: "id" },
    );
    count++;
  }
  console.log(`Donations: ${donations.length}`);

  // === Contacts ===
  const contacts = await readJson<any>("contacts.json");
  for (const c of contacts) {
    await supabase.from("contacts").upsert(
      {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        organisation: c.organisation,
        reason: c.reason,
        message: c.message,
        preferred_response: c.preferredResponse,
        status: c.status,
        created_at: c.createdAt,
      },
      { onConflict: "id" },
    );
    count++;
  }
  console.log(`Contacts: ${contacts.length}`);

  // === Volunteers ===
  const volunteers = await readJson<any>("volunteers.json");
  for (const v of volunteers) {
    await supabase.from("volunteers").upsert(
      {
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        location: v.location,
        interests: v.interests,
        availability: v.availability,
        involvement: v.involvement,
        skills: v.skills,
        motivation: v.motivation,
        experience: v.experience,
        status: v.status,
        created_at: v.createdAt,
      },
      { onConflict: "id" },
    );
    count++;
  }
  console.log(`Volunteers: ${volunteers.length}`);

  // === Partnerships ===
  const partnerships = await readJson<any>("partnerships.json");
  for (const p of partnerships) {
    await supabase.from("partnerships").upsert(
      {
        id: p.id,
        organisation: p.organisation,
        contact_name: p.contactName,
        email: p.email,
        phone: p.phone,
        area: p.area,
        support_type: p.supportType,
        message: p.message,
        meeting_format: p.meetingFormat,
        contact_method: p.contactMethod,
        status: p.status,
        created_at: p.createdAt,
      },
      { onConflict: "id" },
    );
    count++;
  }
  console.log(`Partnerships: ${partnerships.length}`);

  console.log(`\nMigration complete! Total rows upserted: ${count}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
