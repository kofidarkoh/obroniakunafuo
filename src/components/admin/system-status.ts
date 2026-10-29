"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  countPendingDonations,
  countTotalContacts,
  countTotalDonations,
  countTotalPartnerships,
  countTotalVolunteers,
  countUnreadContacts,
  countUnreadPartnerships,
  countUnreadVolunteers,
} from "@/lib/data/store";
import { supabaseConfigured } from "@/lib/supabase/server";
import { listAdminProgrammes, listAdminStories } from "@/lib/data/content";

export type SystemStatus = {
  auth: {
    mode: "supabase" | "mock";
    label: string;
    tone: "green" | "amber" | "coral";
  };
  dataStore: {
    ok: boolean;
    label: string;
    tone: "green" | "amber" | "coral";
  };
  email: {
    ok: boolean;
    label: string;
    tone: "green" | "amber" | "coral";
  };
  environment: string;
  counts: {
    donations: { total: number; pending: number };
    contacts: { total: number; new: number };
    volunteers: { total: number; new: number };
    partnerships: { total: number; new: number };
    stories: number;
    programmes: number;
  };
};

const probeFile = path.join(
  process.env.OAK_DATA_DIR ?? path.resolve(process.cwd(), "data", "db"),
  ".oak_status_probe",
);

async function probeDataStore(): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(probeFile), { recursive: true });
    await fs.writeFile(probeFile, "ok", "utf8");
    await fs.unlink(probeFile);
    return true;
  } catch {
    return false;
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const [donations, contacts, volunteers, partnerships, stories, programmes] =
    await Promise.all([
      countTotalDonations(),
      countTotalContacts(),
      countTotalVolunteers(),
      countTotalPartnerships(),
      listAdminStories(),
      listAdminProgrammes(),
    ]);
  const [pendingDonations, newContacts, newVolunteers, newPartnerships] =
    await Promise.all([
      countPendingDonations(),
      countUnreadContacts(),
      countUnreadVolunteers(),
      countUnreadPartnerships(),
    ]);

  const supabase = supabaseConfigured();
  const dataStoreOk = await probeDataStore();

  return {
    auth: {
      mode: supabase ? "supabase" : "mock",
      label: supabase ? "Supabase" : "Local development (mock)",
      tone: supabase ? "green" : "amber",
    },
    dataStore: {
      ok: dataStoreOk,
      label: dataStoreOk ? "Writable" : "Not writable",
      tone: dataStoreOk ? "green" : "coral",
    },
    email: {
      ok: Boolean(process.env.RESEND_API_KEY),
      label: process.env.RESEND_API_KEY ? "Configured" : "Not configured",
      tone: process.env.RESEND_API_KEY ? "green" : "amber",
    },
    environment: process.env.NODE_ENV ?? "development",
    counts: {
      donations: { total: donations, pending: pendingDonations },
      contacts: { total: contacts, new: newContacts },
      volunteers: { total: volunteers, new: newVolunteers },
      partnerships: { total: partnerships, new: newPartnerships },
      stories: stories.length,
      programmes: programmes.length,
    },
  };
}
