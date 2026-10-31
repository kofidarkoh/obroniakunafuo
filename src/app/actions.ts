"use server";

import { redirect } from "next/navigation";
import {
  createContactMessage,
  createDonation,
  createPartnershipEnquiry,
  createVolunteerApplication,
} from "@/lib/data/store";
import {
  contactSchema,
  donationSchema,
  fieldErrors,
  partnershipSchema,
  volunteerSchema,
  type FormState,
} from "@/lib/validation";
import { makeReference } from "@/lib/utils";
import { notifyAdmin, sendEmail } from "@/lib/email";

function values(formData: FormData) {
  const out: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    const all = formData.getAll(key);
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(values(formData));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  await createContactMessage({
    name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    organisation: parsed.data.organisation || undefined,
    reason: parsed.data.reason,
    message: parsed.data.message,
    preferredResponse: parsed.data.preferredResponse || "Email",
  });

  await notifyAdmin(`New contact message — ${parsed.data.reason}`, [
    { label: "Name", value: parsed.data.fullName },
    { label: "Email", value: parsed.data.email },
    { label: "Phone", value: parsed.data.phone },
    { label: "Organisation", value: parsed.data.organisation },
    { label: "Reason", value: parsed.data.reason },
    { label: "Preferred reply", value: parsed.data.preferredResponse },
    { label: "Message", value: parsed.data.message },
  ]);

  if (parsed.data.email) {
    await sendEmail(parsed.data.email, "We received your message — Obroni Akunafo Kuo", [
      { label: "Name", value: parsed.data.fullName },
      { label: "Reason", value: parsed.data.reason },
      { label: "Message", value: parsed.data.message },
    ]);
  }

  const params = new URLSearchParams({
    name: parsed.data.fullName,
    reason: parsed.data.reason,
    via: parsed.data.preferredResponse,
  });

  redirect(`/contact/success?${params.toString()}`);
}

export async function submitDonation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = donationSchema.safeParse(values(formData));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  const reference = makeReference();

  await createDonation({
    donorName: parsed.data.donorName,
    email: parsed.data.email || "",
    phone: parsed.data.phone,
    amount: parsed.data.amount,
    frequency: parsed.data.frequency,
    method: parsed.data.method,
    reference,
    message: parsed.data.message || undefined,
  });

  await notifyAdmin(
    `New donation — GHC ${parsed.data.amount.toFixed(2)} from ${parsed.data.donorName}`,
    [
      { label: "Reference", value: reference },
      { label: "Donor", value: parsed.data.donorName },
      { label: "Email", value: parsed.data.email },
      { label: "Phone", value: parsed.data.phone },
      { label: "Amount", value: `GHC ${parsed.data.amount.toFixed(2)}` },
      { label: "Frequency", value: parsed.data.frequency },
      { label: "Method", value: parsed.data.method },
      { label: "Message", value: parsed.data.message },
    ],
  );

  if (parsed.data.email) {
    await sendEmail(parsed.data.email, `Donation received — ${reference}`, [
      { label: "Reference", value: reference },
      { label: "Donor", value: parsed.data.donorName },
      { label: "Amount", value: `GHC ${parsed.data.amount.toFixed(2)}` },
      { label: "Frequency", value: parsed.data.frequency },
      { label: "Method", value: parsed.data.method },
    ]);
  }

  const params = new URLSearchParams({
    ref: reference,
    name: parsed.data.donorName,
    amount: String(parsed.data.amount),
    frequency: parsed.data.frequency,
  });

  redirect(`/donate/success?${params.toString()}`);
}

export async function submitVolunteer(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    ...values(formData),
    interests: formData.getAll("interests").map(String),
  };
  const parsed = volunteerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  await createVolunteerApplication({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    location: parsed.data.location,
    interests: parsed.data.interests,
    availability: parsed.data.availability,
    involvement: parsed.data.involvement,
    skills: parsed.data.skills || undefined,
    motivation: parsed.data.motivation,
    experience: parsed.data.experience || undefined,
  });

  await notifyAdmin(`New volunteer application — ${parsed.data.name}`, [
    { label: "Name", value: parsed.data.name },
    { label: "Email", value: parsed.data.email },
    { label: "Phone", value: parsed.data.phone },
    { label: "Location", value: parsed.data.location },
    { label: "Interests", value: parsed.data.interests.join(", ") },
    { label: "Availability", value: parsed.data.availability },
    { label: "Involvement", value: parsed.data.involvement },
    { label: "Skills", value: parsed.data.skills },
    { label: "Motivation", value: parsed.data.motivation },
    { label: "Experience", value: parsed.data.experience },
  ]);

  if (parsed.data.email) {
    await sendEmail(parsed.data.email, "Volunteer application received — Obroni Akunafo Kuo", [
      { label: "Name", value: parsed.data.name },
      { label: "Interests", value: parsed.data.interests.join(", ") },
      { label: "Availability", value: parsed.data.availability },
      { label: "Involvement", value: parsed.data.involvement },
    ]);
  }

  const params = new URLSearchParams({
    name: parsed.data.name,
    areas: parsed.data.interests.join(", "),
    availability: parsed.data.availability,
    involvement: parsed.data.involvement,
    email: parsed.data.email,
  });

  redirect(`/volunteer/success?${params.toString()}`);
}

export async function submitPartnership(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = partnershipSchema.safeParse(values(formData));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  await createPartnershipEnquiry({
    organisation: parsed.data.organisation,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    area: parsed.data.area,
    supportType: parsed.data.supportType,
    message: parsed.data.message,
    meetingFormat: parsed.data.meetingFormat || "",
    contactMethod: parsed.data.contactMethod || "",
  });

  await notifyAdmin(
    `New partnership enquiry — ${parsed.data.organisation}`,
    [
      { label: "Organisation", value: parsed.data.organisation },
      { label: "Contact", value: parsed.data.contactName },
      { label: "Email", value: parsed.data.email },
      { label: "Phone", value: parsed.data.phone },
      { label: "Area", value: parsed.data.area },
      { label: "Support type", value: parsed.data.supportType },
      { label: "Preferred meeting", value: parsed.data.meetingFormat },
      { label: "Contact method", value: parsed.data.contactMethod },
      { label: "Message", value: parsed.data.message },
    ],
  );

  if (parsed.data.email) {
    await sendEmail(parsed.data.email, "Partnership enquiry received — Obroni Akunafo Kuo", [
      { label: "Organisation", value: parsed.data.organisation },
      { label: "Contact", value: parsed.data.contactName },
      { label: "Area", value: parsed.data.area },
      { label: "Support type", value: parsed.data.supportType },
    ]);
  }

  const params = new URLSearchParams({
    org: parsed.data.organisation,
    contact: parsed.data.contactName,
    area: parsed.data.area,
    type: parsed.data.supportType,
    email: parsed.data.email,
  });

  redirect(`/partner/success?${params.toString()}`);
}
