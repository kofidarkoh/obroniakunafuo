import { randomUUID } from "node:crypto";
import { readJson, updateJson } from "@/lib/data/json-db";
import {
  createSupabaseServiceClient,
  supabaseConfigured,
} from "@/lib/supabase/server";
import type {
  AdminNote,
  ContactMessage,
  Donation,
  DonationStatus,
  PartnershipEnquiry,
  SubmissionStatus,
  VolunteerApplication,
} from "@/lib/data/types";

const files = {
  contacts: "contacts.json",
  donations: "donations.json",
  volunteers: "volunteers.json",
  partnerships: "partnerships.json",
} as const;

function generateId() {
  return randomUUID();
}

function now() {
  return new Date().toISOString();
}

/* =========================================================================
   JSON implementations (local development fallback)
   ========================================================================= */

async function listContactsJson() {
  const items = await readJson<ContactMessage[]>(files.contacts, () => []);
  return items.map((item) => ({ ...item, notes: [] }));
}

async function listDonationsJson() {
  const items = await readJson<Donation[]>(files.donations, () => []);
  return [...items];
}

async function listVolunteersJson() {
  const items = await readJson<VolunteerApplication[]>(
    files.volunteers,
    () => [],
  );
  return items.map((item) => ({ ...item, notes: [] }));
}

async function listPartnershipsJson() {
  const items = await readJson<PartnershipEnquiry[]>(
    files.partnerships,
    () => [],
  );
  return items.map((item) => ({ ...item, notes: [] }));
}

async function createContactMessageJson(
  input: Omit<ContactMessage, "id" | "status" | "createdAt" | "notes">,
): Promise<ContactMessage> {
  const record: ContactMessage = {
    ...input,
    id: generateId(),
    status: "new",
    createdAt: now(),
    notes: [],
  };
  await updateJson<ContactMessage[]>(files.contacts, () => [], (items) => {
    items.unshift(record);
  });
  return record;
}

async function createDonationJson(
  input: Omit<
    Donation,
    "id" | "status" | "createdAt" | "acknowledgedAt" | "acknowledgedBy"
  >,
): Promise<Donation> {
  const record: Donation = {
    ...input,
    id: generateId(),
    status: "pending",
    createdAt: now(),
  };
  await updateJson<Donation[]>(files.donations, () => [], (items) => {
    items.unshift(record);
  });
  return record;
}

async function createVolunteerApplicationJson(
  input: Omit<VolunteerApplication, "id" | "status" | "createdAt" | "notes">,
): Promise<VolunteerApplication> {
  const record: VolunteerApplication = {
    ...input,
    id: generateId(),
    status: "new",
    createdAt: now(),
    notes: [],
  };
  await updateJson<VolunteerApplication[]>(
    files.volunteers,
    () => [],
    (items) => {
      items.unshift(record);
    },
  );
  return record;
}

async function createPartnershipEnquiryJson(
  input: Omit<PartnershipEnquiry, "id" | "status" | "createdAt" | "notes">,
): Promise<PartnershipEnquiry> {
  const record: PartnershipEnquiry = {
    ...input,
    id: generateId(),
    status: "new",
    createdAt: now(),
    notes: [],
  };
  await updateJson<PartnershipEnquiry[]>(
    files.partnerships,
    () => [],
    (items) => {
      items.unshift(record);
    },
  );
  return record;
}

async function countUnreadContactsJson() {
  const items = await readJson<ContactMessage[]>(files.contacts, () => []);
  return items.filter((item) => item.status === "new").length;
}

async function countUnreadVolunteersJson() {
  const items = await readJson<VolunteerApplication[]>(
    files.volunteers,
    () => [],
  );
  return items.filter((item) => item.status === "new").length;
}

async function countUnreadPartnershipsJson() {
  const items = await readJson<PartnershipEnquiry[]>(
    files.partnerships,
    () => [],
  );
  return items.filter((item) => item.status === "new").length;
}

async function countPendingDonationsJson() {
  const items = await readJson<Donation[]>(files.donations, () => []);
  return items.filter((item) => item.status === "pending").length;
}

async function countUnreadDonationsJson() {
  return countPendingDonationsJson();
}

async function countTotalContactsJson() {
  const items = await readJson<ContactMessage[]>(files.contacts, () => []);
  return items.length;
}

async function countTotalDonationsJson() {
  const items = await readJson<Donation[]>(files.donations, () => []);
  return items.length;
}

async function countTotalVolunteersJson() {
  const items = await readJson<VolunteerApplication[]>(
    files.volunteers,
    () => [],
  );
  return items.length;
}

async function countTotalPartnershipsJson() {
  const items = await readJson<PartnershipEnquiry[]>(
    files.partnerships,
    () => [],
  );
  return items.length;
}

async function getDonationJson(id: string) {
  const items = await readJson<Donation[]>(files.donations, () => []);
  const donation = items.find((item) => item.id === id);
  if (!donation) return undefined;
  donation.notes = donation.notes ?? [];
  return donation;
}

async function getContactJson(id: string) {
  const items = await readJson<ContactMessage[]>(files.contacts, () => []);
  return items.find((item) => item.id === id);
}

async function getVolunteerJson(id: string) {
  const items = await readJson<VolunteerApplication[]>(
    files.volunteers,
    () => [],
  );
  return items.find((item) => item.id === id);
}

async function getPartnershipJson(id: string) {
  const items = await readJson<PartnershipEnquiry[]>(
    files.partnerships,
    () => [],
  );
  return items.find((item) => item.id === id);
}

async function setDonationStatusJson(
  id: string,
  status: DonationStatus,
) {
  let updated: Donation | null = null;

  await updateJson<Donation[]>(files.donations, () => [], (items) => {
    const donation = items.find((item) => item.id === id);
    if (!donation) return;
    donation.status = status;
    donation.confirmedAt = status === "confirmed" ? now() : undefined;
    if (status !== "confirmed") {
      donation.acknowledgedAt = undefined;
      donation.acknowledgedBy = undefined;
    }
    updated = donation;
  });

  return updated;
}

async function confirmDonationJson(id: string) {
  return setDonationStatusJson(id, "confirmed");
}

async function acknowledgeDonationJson(
  id: string,
  author: string,
): Promise<Donation | null> {
  let updated: Donation | null = null;

  await updateJson<Donation[]>(files.donations, () => [], (items) => {
    const donation = items.find((item) => item.id === id);
    if (!donation) return;
    donation.acknowledgedAt = now();
    donation.acknowledgedBy = author;
    updated = donation;
  });

  return updated;
}

async function deleteDonationJson(id: string) {
  let removed = false;
  await updateJson<Donation[]>(files.donations, () => [], (items) => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    items.splice(index, 1);
    removed = true;
  });
  return removed;
}

async function deleteSubmissionJson(
  collection: "contacts" | "volunteers" | "partnerships",
  id: string,
) {
  let removed = false;
  await updateJson<(ContactMessage | VolunteerApplication | PartnershipEnquiry)[]>(
    files[collection],
    () => [],
    (items) => {
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return;
      items.splice(index, 1);
      removed = true;
    },
  );
  return removed;
}

async function setSubmissionStatusJson(
  collection: "contacts" | "volunteers" | "partnerships",
  id: string,
  status: SubmissionStatus,
) {
  let updated: ContactMessage | VolunteerApplication | PartnershipEnquiry | null =
    null;

  await updateJson<(ContactMessage | VolunteerApplication | PartnershipEnquiry)[]>(
    files[collection],
    () => [],
    (items) => {
      const record = items.find((item) => item.id === id);
      if (!record) return;
      record.status = status;
      updated = record;
    },
  );

  return updated;
}

async function addNoteJson(
  collection: "contacts" | "volunteers" | "partnerships" | "donations",
  id: string,
  author: string,
  text: string,
) {
  let note: AdminNote | null = null;

  if (collection === "donations") {
    await updateJson<Donation[]>(files.donations, () => [], (items) => {
      const record = items.find((item) => item.id === id);
      if (!record) return;
      record.notes ??= [];
      note = { id: generateId(), author, text, createdAt: now() };
      record.notes.unshift(note);
    });
    return note;
  }

  await updateJson<(ContactMessage | VolunteerApplication | PartnershipEnquiry)[]>(
    files[collection],
    () => [],
    (items) => {
      const record = items.find((item) => item.id === id);
      if (!record) return;
      record.notes ??= [];
      note = { id: generateId(), author, text, createdAt: now() };
      record.notes.unshift(note);
    },
  );

  return note;
}

async function listNotesJson(
  collection: "contacts" | "volunteers" | "partnerships" | "donations",
  id: string,
): Promise<AdminNote[]> {
  if (collection === "donations") {
    const items = await readJson<Donation[]>(files.donations, () => []);
    const record = items.find((item) => item.id === id);
    return record?.notes ?? [];
  }
  const items = await readJson<(ContactMessage | VolunteerApplication | PartnershipEnquiry)[]>(
    files[collection],
    () => [],
  );
  const record = items.find((item) => item.id === id);
  return record?.notes ?? [];
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

async function listContactsSupabase(): Promise<ContactMessage[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    organisation: row.organisation ?? undefined,
    reason: row.reason,
    message: row.message,
    preferredResponse: row.preferred_response,
    status: row.status,
    createdAt: row.created_at,
    notes: [],
  }));
}

async function listDonationsSupabase(): Promise<Donation[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    donorName: row.donor_name,
    email: row.email,
    phone: row.phone,
    amount: row.amount,
    frequency: row.frequency,
    method: row.method,
    reference: row.reference,
    message: row.message ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    confirmedAt: row.confirmed_at ?? undefined,
    acknowledgedAt: row.acknowledged_at ?? undefined,
    acknowledgedBy: row.acknowledged_by ?? undefined,
  }));
}

async function listVolunteersSupabase(): Promise<VolunteerApplication[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    interests: row.interests ?? [],
    availability: row.availability,
    involvement: row.involvement,
    skills: row.skills ?? undefined,
    motivation: row.motivation ?? undefined,
    experience: row.experience ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    notes: [],
  }));
}

async function listPartnershipsSupabase(): Promise<PartnershipEnquiry[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("partnerships")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    organisation: row.organisation,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    area: row.area,
    supportType: row.support_type,
    message: row.message,
    meetingFormat: row.meeting_format,
    contactMethod: row.contact_method,
    status: row.status,
    createdAt: row.created_at,
    notes: [],
  }));
}

async function createContactMessageSupabase(
  input: Omit<ContactMessage, "id" | "status" | "createdAt" | "notes">,
): Promise<ContactMessage> {
  const supabase = await getSupabase();
  const record = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    organisation: input.organisation,
    reason: input.reason,
    message: input.message,
    preferred_response: input.preferredResponse,
    status: "new",
    created_at: now(),
  };
  const { data, error } = await supabase
    .from("contacts")
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    organisation: data.organisation ?? undefined,
    reason: data.reason,
    message: data.message,
    preferredResponse: data.preferred_response,
    status: data.status,
    createdAt: data.created_at,
    notes: [],
  };
}

async function createDonationSupabase(
  input: Omit<
    Donation,
    "id" | "status" | "createdAt" | "acknowledgedAt" | "acknowledgedBy"
  >,
): Promise<Donation> {
  const supabase = await getSupabase();
  const record = {
    donor_name: input.donorName,
    email: input.email,
    phone: input.phone,
    amount: input.amount,
    frequency: input.frequency,
    method: input.method,
    reference: input.reference,
    message: input.message,
    status: "pending",
    created_at: now(),
  };
  const { data, error } = await supabase
    .from("donations")
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    donorName: data.donor_name,
    email: data.email,
    phone: data.phone,
    amount: data.amount,
    frequency: data.frequency,
    method: data.method,
    reference: data.reference,
    message: data.message ?? undefined,
    status: data.status,
    createdAt: data.created_at,
    confirmedAt: data.confirmed_at ?? undefined,
    acknowledgedAt: data.acknowledged_at ?? undefined,
    acknowledgedBy: data.acknowledged_by ?? undefined,
  };
}

async function createVolunteerApplicationSupabase(
  input: Omit<VolunteerApplication, "id" | "status" | "createdAt" | "notes">,
): Promise<VolunteerApplication> {
  const supabase = await getSupabase();
  const record = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    location: input.location,
    interests: input.interests,
    availability: input.availability,
    involvement: input.involvement,
    skills: input.skills,
    motivation: input.motivation,
    experience: input.experience,
    status: "new",
    created_at: now(),
  };
  const { data, error } = await supabase
    .from("volunteers")
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    location: data.location,
    interests: data.interests ?? [],
    availability: data.availability,
    involvement: data.involvement,
    skills: data.skills ?? undefined,
    motivation: data.motivation ?? undefined,
    experience: data.experience ?? undefined,
    status: data.status,
    createdAt: data.created_at,
    notes: [],
  };
}

async function createPartnershipEnquirySupabase(
  input: Omit<PartnershipEnquiry, "id" | "status" | "createdAt" | "notes">,
): Promise<PartnershipEnquiry> {
  const supabase = await getSupabase();
  const record = {
    organisation: input.organisation,
    contact_name: input.contactName,
    email: input.email,
    phone: input.phone,
    area: input.area,
    support_type: input.supportType,
    message: input.message,
    meeting_format: input.meetingFormat,
    contact_method: input.contactMethod,
    status: "new",
    created_at: now(),
  };
  const { data, error } = await supabase
    .from("partnerships")
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    organisation: data.organisation,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    area: data.area,
    supportType: data.support_type,
    message: data.message,
    meetingFormat: data.meeting_format,
    contactMethod: data.contact_method,
    status: data.status,
    createdAt: data.created_at,
    notes: [],
  };
}

async function countUnreadContactsSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("contacts")
    .select("*", { head: true, count: "exact" })
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
}

async function countUnreadVolunteersSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("volunteers")
    .select("*", { head: true, count: "exact" })
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
}

async function countUnreadPartnershipsSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("partnerships")
    .select("*", { head: true, count: "exact" })
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
}

async function countPendingDonationsSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("donations")
    .select("*", { head: true, count: "exact" })
    .eq("status", "pending");
  if (error) throw error;
  return count ?? 0;
}

async function countUnreadDonationsSupabase() {
  return countPendingDonationsSupabase();
}

async function countTotalContactsSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("contacts")
    .select("*", { head: true, count: "exact" });
  if (error) throw error;
  return count ?? 0;
}

async function countTotalDonationsSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("donations")
    .select("*", { head: true, count: "exact" });
  if (error) throw error;
  return count ?? 0;
}

async function countTotalVolunteersSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("volunteers")
    .select("*", { head: true, count: "exact" });
  if (error) throw error;
  return count ?? 0;
}

async function countTotalPartnershipsSupabase() {
  const supabase = await getSupabase();
  const { count, error } = await supabase
    .from("partnerships")
    .select("*", { head: true, count: "exact" });
  if (error) throw error;
  return count ?? 0;
}

async function getDonationSupabase(id: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const notes = await listNotesSupabase("donations", id);
  return {
    id: data.id,
    donorName: data.donor_name,
    email: data.email,
    phone: data.phone,
    amount: data.amount,
    frequency: data.frequency,
    method: data.method,
    reference: data.reference,
    message: data.message ?? undefined,
    status: data.status,
    createdAt: data.created_at,
    confirmedAt: data.confirmed_at ?? undefined,
    acknowledgedAt: data.acknowledged_at ?? undefined,
    acknowledgedBy: data.acknowledged_by ?? undefined,
    notes,
  };
}

async function getContactSupabase(id: string): Promise<ContactMessage | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  // Fetch notes for this record
  const { data: noteRows } = await supabase
    .from("notes")
    .select("*")
    .eq("collection", "contacts")
    .eq("record_id", id)
    .order("created_at", { ascending: false });
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    organisation: data.organisation ?? undefined,
    reason: data.reason,
    message: data.message,
    preferredResponse: data.preferred_response,
    status: data.status,
    createdAt: data.created_at,
    notes: (noteRows ?? []).map((row) => ({
      id: row.id,
      author: row.author,
      text: row.text,
      createdAt: row.created_at,
    })),
  };
}

async function getVolunteerSupabase(
  id: string,
): Promise<VolunteerApplication | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: noteRows } = await supabase
    .from("notes")
    .select("*")
    .eq("collection", "volunteers")
    .eq("record_id", id)
    .order("created_at", { ascending: false });
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    location: data.location,
    interests: data.interests ?? [],
    availability: data.availability,
    involvement: data.involvement,
    skills: data.skills ?? undefined,
    motivation: data.motivation ?? undefined,
    experience: data.experience ?? undefined,
    status: data.status,
    createdAt: data.created_at,
    notes: (noteRows ?? []).map((row) => ({
      id: row.id,
      author: row.author,
      text: row.text,
      createdAt: row.created_at,
    })),
  };
}

async function getPartnershipSupabase(
  id: string,
): Promise<PartnershipEnquiry | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("partnerships")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: noteRows } = await supabase
    .from("notes")
    .select("*")
    .eq("collection", "partnerships")
    .eq("record_id", id)
    .order("created_at", { ascending: false });
  return {
    id: data.id,
    organisation: data.organisation,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    area: data.area,
    supportType: data.support_type,
    message: data.message,
    meetingFormat: data.meeting_format,
    contactMethod: data.contact_method,
    status: data.status,
    createdAt: data.created_at,
    notes: (noteRows ?? []).map((row) => ({
      id: row.id,
      author: row.author,
      text: row.text,
      createdAt: row.created_at,
    })),
  };
}

async function setDonationStatusSupabase(
  id: string,
  status: DonationStatus,
) {
  const supabase = await getSupabase();
  const updates: Record<string, unknown> = { status };
  if (status === "confirmed") {
    updates.confirmed_at = now();
  } else {
    updates.confirmed_at = null;
    updates.acknowledged_at = null;
    updates.acknowledged_by = null;
  }
  const { data, error } = await supabase
    .from("donations")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    donorName: data.donor_name,
    email: data.email,
    phone: data.phone,
    amount: data.amount,
    frequency: data.frequency,
    method: data.method,
    reference: data.reference,
    message: data.message ?? undefined,
    status: data.status,
    createdAt: data.created_at,
    confirmedAt: data.confirmed_at ?? undefined,
    acknowledgedAt: data.acknowledged_at ?? undefined,
    acknowledgedBy: data.acknowledged_by ?? undefined,
  };
}

async function confirmDonationSupabase(id: string) {
  return setDonationStatusSupabase(id, "confirmed");
}

async function acknowledgeDonationSupabase(
  id: string,
  author: string,
): Promise<Donation | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("donations")
    .update({ acknowledged_at: now(), acknowledged_by: author })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    donorName: data.donor_name,
    email: data.email,
    phone: data.phone,
    amount: data.amount,
    frequency: data.frequency,
    method: data.method,
    reference: data.reference,
    message: data.message ?? undefined,
    status: data.status,
    createdAt: data.created_at,
    confirmedAt: data.confirmed_at ?? undefined,
    acknowledgedAt: data.acknowledged_at ?? undefined,
    acknowledgedBy: data.acknowledged_by ?? undefined,
  };
}

async function setSubmissionStatusSupabase(
  collection: "contacts" | "volunteers" | "partnerships",
  id: string,
  status: SubmissionStatus,
) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(collection)
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  if (collection === "contacts") {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone ?? undefined,
      organisation: data.organisation ?? undefined,
      reason: data.reason,
      message: data.message,
      preferredResponse: data.preferred_response,
      status: data.status,
      createdAt: data.created_at,
      notes: [],
    };
  }

  if (collection === "volunteers") {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      interests: data.interests ?? [],
      availability: data.availability,
      involvement: data.involvement,
      skills: data.skills ?? undefined,
      motivation: data.motivation ?? undefined,
      experience: data.experience ?? undefined,
      status: data.status,
      createdAt: data.created_at,
      notes: [],
    };
  }

  return {
    id: data.id,
    organisation: data.organisation,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    area: data.area,
    supportType: data.support_type,
    message: data.message,
    meetingFormat: data.meeting_format,
    contactMethod: data.contact_method,
    status: data.status,
    createdAt: data.created_at,
    notes: [],
  };
}

async function deleteDonationSupabase(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from("donations").delete().eq("id", id);
  if (error) throw error;
  return true;
}

async function deleteSubmissionSupabase(
  collection: "contacts" | "volunteers" | "partnerships",
  id: string,
) {
  const supabase = await getSupabase();
  const { error } = await supabase.from(collection).delete().eq("id", id);
  if (error) throw error;
  return true;
}

async function addNoteSupabase(
  collection: "contacts" | "volunteers" | "partnerships" | "donations",
  id: string,
  author: string,
  text: string,
) {
  const supabase = await getSupabase();
  const noteId = generateId();
  const record = {
    id: noteId,
    collection,
    record_id: id,
    author,
    text,
    created_at: now(),
  };
  const { error } = await supabase.from("notes").insert(record);
  if (error) throw error;
  return { id: noteId, author, text, createdAt: now() };
}

async function listNotesSupabase(
  collection: "contacts" | "volunteers" | "partnerships" | "donations",
  id: string,
): Promise<AdminNote[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("collection", collection)
    .eq("record_id", id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    author: row.author,
    text: row.text,
    createdAt: row.created_at,
  }));
}

/* =========================================================================
   Paginated, searchable listing helpers
   ========================================================================= */

type StatusCounts = Record<string, number>;

function tallyStatuses(rows: Array<{ status?: string | null }> | null) {
  const counts: StatusCounts = { all: rows?.length ?? 0 };
  for (const row of rows ?? []) {
    if (row.status) counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

async function listContactsPaginatedSupabase({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("contacts").select("*", { count: "exact" });
  let statusQuery = supabase.from("contacts").select("status");

  if (search) {
    const q = `%${search}%`;
    const filter = `name.ilike.${q},email.ilike.${q},message.ilike.${q},reason.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.order("created_at", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    counts: tallyStatuses(statusRows),
    items: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone ?? undefined,
      organisation: row.organisation ?? undefined,
      reason: row.reason,
      message: row.message,
      preferredResponse: row.preferred_response,
      status: row.status,
      createdAt: row.created_at,
      notes: [],
    })),
    total: count ?? 0,
    page,
    pageSize,
  };
}

async function listDonationsPaginatedSupabase({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("donations").select("*", { count: "exact" });
  let statusQuery = supabase.from("donations").select("status");

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    const q = `%${search}%`;
    const filter = `donor_name.ilike.${q},email.ilike.${q},reference.ilike.${q},phone.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.order("created_at", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    items: (data ?? []).map((row) => ({
      id: row.id,
      donorName: row.donor_name,
      email: row.email,
      phone: row.phone,
      amount: row.amount,
      frequency: row.frequency,
      method: row.method,
      reference: row.reference,
      message: row.message ?? undefined,
      status: row.status,
      createdAt: row.created_at,
      confirmedAt: row.confirmed_at ?? undefined,
      acknowledgedAt: row.acknowledged_at ?? undefined,
      acknowledgedBy: row.acknowledged_by ?? undefined,
    })),
    total: count ?? 0,
    page,
    pageSize,
    counts: tallyStatuses(statusRows),
  };
}

async function listVolunteersPaginatedSupabase({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("volunteers").select("*", { count: "exact" });
  let statusQuery = supabase.from("volunteers").select("status");

  if (search) {
    const q = `%${search}%`;
    const filter = `name.ilike.${q},email.ilike.${q},location.ilike.${q},motivation.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.order("created_at", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    counts: tallyStatuses(statusRows),
    items: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      interests: row.interests ?? [],
      availability: row.availability,
      involvement: row.involvement,
      skills: row.skills ?? undefined,
      motivation: row.motivation ?? undefined,
      experience: row.experience ?? undefined,
      status: row.status,
      createdAt: row.created_at,
      notes: [],
    })),
    total: count ?? 0,
    page,
    pageSize,
  };
}

async function listPartnershipsPaginatedSupabase({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const supabase = await getSupabase();
  let query = supabase.from("partnerships").select("*", { count: "exact" });
  let statusQuery = supabase.from("partnerships").select("status");

  if (search) {
    const q = `%${search}%`;
    const filter = `organisation.ilike.${q},contact_name.ilike.${q},email.ilike.${q},message.ilike.${q}`;
    query = query.or(filter);
    statusQuery = statusQuery.or(filter);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.order("created_at", { ascending: false }).range(from, to);

  const [{ data, error, count }, { data: statusRows, error: statusError }] =
    await Promise.all([query, statusQuery]);
  if (error) throw error;
  if (statusError) throw statusError;

  return {
    counts: tallyStatuses(statusRows),
    items: (data ?? []).map((row) => ({
      id: row.id,
      organisation: row.organisation,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      area: row.area,
      supportType: row.support_type,
      message: row.message,
      meetingFormat: row.meeting_format,
      contactMethod: row.contact_method,
      status: row.status,
      createdAt: row.created_at,
      notes: [],
    })),
    total: count ?? 0,
    page,
    pageSize,
  };
}

/* =========================================================================
   Exported functions (dual implementation)
   ========================================================================= */

export async function createContactMessage(
  input: Omit<ContactMessage, "id" | "status" | "createdAt" | "notes">,
): Promise<ContactMessage> {
  if (supabaseConfigured()) {
    return createContactMessageSupabase(input);
  }
  return createContactMessageJson(input);
}

export async function createDonation(
  input: Omit<
    Donation,
    "id" | "status" | "createdAt" | "acknowledgedAt" | "acknowledgedBy"
  >,
): Promise<Donation> {
  if (supabaseConfigured()) {
    return createDonationSupabase(input);
  }
  return createDonationJson(input);
}

export async function createVolunteerApplication(
  input: Omit<VolunteerApplication, "id" | "status" | "createdAt" | "notes">,
): Promise<VolunteerApplication> {
  if (supabaseConfigured()) {
    return createVolunteerApplicationSupabase(input);
  }
  return createVolunteerApplicationJson(input);
}

export async function createPartnershipEnquiry(
  input: Omit<PartnershipEnquiry, "id" | "status" | "createdAt" | "notes">,
): Promise<PartnershipEnquiry> {
  if (supabaseConfigured()) {
    return createPartnershipEnquirySupabase(input);
  }
  return createPartnershipEnquiryJson(input);
}

export async function listContacts() {
  if (supabaseConfigured()) {
    return listContactsSupabase();
  }
  return listContactsJson();
}

export async function listDonations() {
  if (supabaseConfigured()) {
    return listDonationsSupabase();
  }
  return listDonationsJson();
}

export async function listVolunteers() {
  if (supabaseConfigured()) {
    return listVolunteersSupabase();
  }
  return listVolunteersJson();
}

export async function listPartnerships() {
  if (supabaseConfigured()) {
    return listPartnershipsSupabase();
  }
  return listPartnershipsJson();
}

export async function countUnreadContacts() {
  if (supabaseConfigured()) {
    return countUnreadContactsSupabase();
  }
  return countUnreadContactsJson();
}

export async function countUnreadVolunteers() {
  if (supabaseConfigured()) {
    return countUnreadVolunteersSupabase();
  }
  return countUnreadVolunteersJson();
}

export async function countUnreadPartnerships() {
  if (supabaseConfigured()) {
    return countUnreadPartnershipsSupabase();
  }
  return countUnreadPartnershipsJson();
}

export async function countPendingDonations() {
  if (supabaseConfigured()) {
    return countPendingDonationsSupabase();
  }
  return countPendingDonationsJson();
}

export async function countUnreadDonations() {
  if (supabaseConfigured()) {
    return countUnreadDonationsSupabase();
  }
  return countUnreadDonationsJson();
}

export async function countTotalContacts() {
  if (supabaseConfigured()) {
    return countTotalContactsSupabase();
  }
  return countTotalContactsJson();
}

export async function countTotalDonations() {
  if (supabaseConfigured()) {
    return countTotalDonationsSupabase();
  }
  return countTotalDonationsJson();
}

export async function countTotalVolunteers() {
  if (supabaseConfigured()) {
    return countTotalVolunteersSupabase();
  }
  return countTotalVolunteersJson();
}

export async function countTotalPartnerships() {
  if (supabaseConfigured()) {
    return countTotalPartnershipsSupabase();
  }
  return countTotalPartnershipsJson();
}

export async function getDonation(id: string) {
  if (supabaseConfigured()) {
    return getDonationSupabase(id);
  }
  return getDonationJson(id);
}

export async function getContact(id: string) {
  if (supabaseConfigured()) {
    return getContactSupabase(id);
  }
  return getContactJson(id);
}

export async function getVolunteer(id: string) {
  if (supabaseConfigured()) {
    return getVolunteerSupabase(id);
  }
  return getVolunteerJson(id);
}

export async function getPartnership(id: string) {
  if (supabaseConfigured()) {
    return getPartnershipSupabase(id);
  }
  return getPartnershipJson(id);
}

export async function setDonationStatus(
  id: string,
  status: DonationStatus,
) {
  if (supabaseConfigured()) {
    return setDonationStatusSupabase(id, status);
  }
  return setDonationStatusJson(id, status);
}

export async function confirmDonation(id: string) {
  if (supabaseConfigured()) {
    return confirmDonationSupabase(id);
  }
  return confirmDonationJson(id);
}

export async function acknowledgeDonation(
  id: string,
  author: string,
): Promise<Donation | null> {
  if (supabaseConfigured()) {
    return acknowledgeDonationSupabase(id, author);
  }
  return acknowledgeDonationJson(id, author);
}

export async function setSubmissionStatus(
  collection: "contacts" | "volunteers" | "partnerships",
  id: string,
  status: SubmissionStatus,
) {
  if (supabaseConfigured()) {
    return setSubmissionStatusSupabase(collection, id, status);
  }
  return setSubmissionStatusJson(collection, id, status);
}

export async function deleteDonation(id: string) {
  if (supabaseConfigured()) {
    return deleteDonationSupabase(id);
  }
  return deleteDonationJson(id);
}

export async function deleteSubmission(
  collection: "contacts" | "volunteers" | "partnerships",
  id: string,
) {
  if (supabaseConfigured()) {
    return deleteSubmissionSupabase(collection, id);
  }
  return deleteSubmissionJson(collection, id);
}

export async function addNote(
  collection: "contacts" | "volunteers" | "partnerships" | "donations",
  id: string,
  author: string,
  text: string,
) {
  if (supabaseConfigured()) {
    return addNoteSupabase(collection, id, author, text);
  }
  return addNoteJson(collection, id, author, text);
}

export async function listNotes(
  collection: "contacts" | "volunteers" | "partnerships" | "donations",
  id: string,
): Promise<AdminNote[]> {
  if (supabaseConfigured()) {
    return listNotesSupabase(collection, id);
  }
  return listNotesJson(collection, id);
}

/* =========================================================================
   Paginated exports
   ========================================================================= */

export async function listContactsPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listContactsPaginatedSupabase(args);
  }
  // JSON fallback
  const items = await readJson<ContactMessage[]>(files.contacts, () => []);
  let filtered = items;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q),
    );
  }
  const counts = tallyStatuses(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered.slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

export async function listDonationsPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listDonationsPaginatedSupabase(args);
  }
  const items = await readJson<Donation[]>(files.donations, () => []);
  let filtered = items;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.donorName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.phone.includes(q),
    );
  }
  const counts = tallyStatuses(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered.slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

export async function listVolunteersPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listVolunteersPaginatedSupabase(args);
  }
  const items = await readJson<VolunteerApplication[]>(
    files.volunteers,
    () => [],
  );
  let filtered = items;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.motivation?.toLowerCase().includes(q),
    );
  }
  const counts = tallyStatuses(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered.slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

export async function listPartnershipsPaginated(args: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  if (supabaseConfigured()) {
    return listPartnershipsPaginatedSupabase(args);
  }
  const items = await readJson<PartnershipEnquiry[]>(
    files.partnerships,
    () => [],
  );
  let filtered = items;
  if (args.search) {
    const q = args.search.toLowerCase();
    filtered = items.filter(
      (item) =>
        item.organisation.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q),
    );
  }
  const counts = tallyStatuses(filtered);
  if (args.status && args.status !== "all") {
    filtered = filtered.filter((item) => item.status === args.status);
  }
  const total = filtered.length;
  const from = (args.page - 1) * args.pageSize;
  return {
    items: filtered.slice(from, from + args.pageSize),
    total,
    counts,
    page: args.page,
    pageSize: args.pageSize,
  };
}

