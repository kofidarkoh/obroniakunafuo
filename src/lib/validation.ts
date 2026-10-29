import { z } from "zod";

const consent = z
  .string()
  .optional()
  .refine((value) => value === "on", {
    message: "Please agree before submitting",
  });

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional().or(z.literal("")),
  organisation: z.string().trim().optional().or(z.literal("")),
  reason: z.string().min(1, "Please choose a reason for contact"),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters)"),
  preferredResponse: z
    .string()
    .optional()
    .or(z.literal(""))
    .default("Email"),
  consent,
});

export const donationSchema = z.object({
  amount: z.coerce
    .number({ message: "Enter a valid amount" })
    .min(1, "Please enter an amount of at least GH₵1"),
  frequency: z.enum(["once", "monthly"]),
  method: z.enum(["momo", "bank"]),
  donorName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(7, "Please enter a valid phone number"),
  message: z.string().trim().optional().or(z.literal("")),
  consent,
});

export const volunteerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number"),
  location: z.string().trim().min(2, "Please enter your location"),
  interests: z
    .array(z.string())
    .min(1, "Please choose at least one area of interest"),
  availability: z.string().min(1, "Please choose your availability"),
  involvement: z.string().min(1, "Please choose your preferred involvement"),
  skills: z.string().trim().optional().or(z.literal("")),
  motivation: z
    .string()
    .trim()
    .min(10, "Please tell us a little about why you want to volunteer"),
  experience: z.string().trim().optional().or(z.literal("")),
  consent,
});

export const partnershipSchema = z.object({
  organisation: z.string().trim().min(2, "Please enter your organisation name"),
  contactName: z.string().trim().min(2, "Please enter the contact person"),
  email: z.string().trim().email("Enter a valid work email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number"),
  area: z.string().min(1, "Please choose an area of interest"),
  supportType: z.string().min(1, "Please choose a type of support"),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more about the partnership"),
  meetingFormat: z.string().optional().or(z.literal("")),
  contactMethod: z.string().optional().or(z.literal("")),
  consent,
});

export type FormState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export function fieldErrors(
  error: z.ZodError,
): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
