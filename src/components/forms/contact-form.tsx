"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitContact } from "@/app/actions";
import {
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form";
import { contactReasons, responseMethods } from "@/lib/site";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={action} className="mt-8">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
        <p className="eyebrow text-muted">Your information</p>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grass">
          Step 1
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          htmlFor="fullName"
          required
          error={errors.fullName?.[0]}
        >
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter full name"
            autoComplete="name"
            invalid={Boolean(errors.fullName)}
          />
        </Field>
        <Field
          label="Email address"
          htmlFor="email"
          required
          error={errors.email?.[0]}
        >
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="enter@email.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field
          label="Phone number (optional)"
          htmlFor="phone"
          error={errors.phone?.[0]}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+233"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
          />
        </Field>
        <Field
          label="Organisation (optional)"
          htmlFor="organisation"
          error={errors.organisation?.[0]}
        >
          <Input
            id="organisation"
            name="organisation"
            placeholder="Your organisation name"
            autoComplete="organization"
          />
        </Field>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-b border-line pb-3">
        <p className="eyebrow text-muted">Your message</p>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grass">
          Step 2
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="Reason for contact"
          htmlFor="reason"
          required
          error={errors.reason?.[0]}
        >
          <Select
            id="reason"
            name="reason"
            defaultValue=""
            invalid={Boolean(errors.reason)}
          >
            <option value="" disabled>
              Select a reason…
            </option>
            {contactReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Your message"
          htmlFor="message"
          required
          error={errors.message?.[0]}
        >
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us what you'd like to know or discuss"
            invalid={Boolean(errors.message)}
          />
        </Field>

        <Field
          label="Preferred response method (optional)"
          htmlFor="preferredResponse"
          error={errors.preferredResponse?.[0]}
        >
          <Select
            id="preferredResponse"
            name="preferredResponse"
            defaultValue="Email"
          >
            {responseMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-6 rounded-[10px] bg-paper p-4">
        <Checkbox
          name="consent"
          required
          label="I agree that Obroni Akunafo Kuo may use the information I provide to respond to my enquiry. My details will be handled with care and not shared with third parties."
        />
        {errors.consent?.[0] ? (
          <p className="mt-2 text-xs font-medium text-coral">
            {errors.consent[0]}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-grass text-[15px] font-semibold text-white transition-colors hover:bg-moss disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        We aim to respond within 2–3 working days.
      </p>
    </form>
  );
}
