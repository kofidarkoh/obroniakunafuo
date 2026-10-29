"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitPartnership } from "@/app/actions";
import {
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form";
import {
  contactMethods,
  meetingFormats,
  partnerAreas,
  partnerSupportTypes,
} from "@/lib/site";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function PartnerForm() {
  const [state, action, pending] = useActionState(
    submitPartnership,
    initialState,
  );
  const errors = state.errors ?? {};

  return (
    <form action={action}>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
        <p className="eyebrow text-muted">Organisation details</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Organisation name"
          htmlFor="organisation"
          required
          error={errors.organisation?.[0]}
        >
          <Input
            id="organisation"
            name="organisation"
            placeholder="Fidelity Bank Ghana"
            autoComplete="organization"
            invalid={Boolean(errors.organisation)}
          />
        </Field>
        <Field
          label="Contact person"
          htmlFor="contactName"
          required
          error={errors.contactName?.[0]}
        >
          <Input
            id="contactName"
            name="contactName"
            placeholder="Michael Asante"
            autoComplete="name"
            invalid={Boolean(errors.contactName)}
          />
        </Field>
        <Field
          label="Work email"
          htmlFor="partnerEmail"
          required
          error={errors.email?.[0]}
        >
          <Input
            id="partnerEmail"
            name="email"
            type="email"
            placeholder="m.asante@fidelity.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field
          label="Phone number"
          htmlFor="partnerPhone"
          required
          error={errors.phone?.[0]}
        >
          <Input
            id="partnerPhone"
            name="phone"
            type="tel"
            placeholder="+233 0543088817"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
          />
        </Field>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-b border-line pb-3">
        <p className="eyebrow text-muted">Partnership information</p>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="Area of interest"
          htmlFor="area"
          required
          error={errors.area?.[0]}
        >
          <Select
            id="area"
            name="area"
            defaultValue=""
            invalid={Boolean(errors.area)}
          >
            <option value="" disabled>
              Select an area…
            </option>
            {partnerAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Type of support or collaboration"
          htmlFor="supportType"
          required
          error={errors.supportType?.[0]}
        >
          <Select
            id="supportType"
            name="supportType"
            defaultValue=""
            invalid={Boolean(errors.supportType)}
          >
            <option value="" disabled>
              Select a type of support…
            </option>
            {partnerSupportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Tell us about your interest"
          htmlFor="partnerMessage"
          required
          error={errors.message?.[0]}
        >
          <Textarea
            id="partnerMessage"
            name="message"
            placeholder="Our CSR department is exploring partnerships with community organisations in the Ahafo and surrounding regions. We are particularly interested in programmes supporting vulnerable women and education access."
            invalid={Boolean(errors.message)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Preferred meeting format (optional)"
            htmlFor="meetingFormat"
            error={errors.meetingFormat?.[0]}
          >
            <Select
              id="meetingFormat"
              name="meetingFormat"
              defaultValue="Video call"
            >
              {meetingFormats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Preferred contact method (optional)"
            htmlFor="contactMethod"
            error={errors.contactMethod?.[0]}
          >
            <Select
              id="contactMethod"
              name="contactMethod"
              defaultValue="Email"
            >
              {contactMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-[8px] bg-paper p-4">
        <Checkbox
          name="consent"
          required
          label="I agree that Obroni Akunafo Kuo may use the information I provide to contact my organisation about partnership opportunities. This enquiry does not constitute a commitment or agreement."
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
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-grass text-[15px] font-semibold text-white transition-colors hover:bg-moss disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Submitting…" : "Request a partnership meeting"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Our team will respond within 3–5 working days.
      </p>
    </form>
  );
}
