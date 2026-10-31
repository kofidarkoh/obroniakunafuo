"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { submitVolunteer } from "@/app/actions";
import {
  Checkbox,
  Field,
  Input,
  Textarea,
} from "@/components/ui/form";
import {
  availabilityOptions,
  involvementOptions,
  volunteerInterests,
} from "@/lib/site";
import type { FormState } from "@/lib/validation";
import { cn } from "@/lib/utils";

const initialState: FormState = { ok: false };

function StepHeader({ title, step }: { title: string; step: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
      <p className="eyebrow text-muted">{title}</p>
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-grass">
        Step {step} of 4
      </p>
    </div>
  );
}

export function VolunteerForm() {
  const [state, action, pending] = useActionState(
    submitVolunteer,
    initialState,
  );
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [involvement, setInvolvement] = useState("");
  const errors = state.errors ?? {};

  const toggleInterest = (value: string) => {
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  return (
    <form action={action} className="rounded-[10px] bg-white p-6 sm:p-8">
      {/* Step 1 */}
      <StepHeader title="Personal information" step="1" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          htmlFor="volName"
          required
          error={errors.name?.[0]}
        >
          <Input
            id="volName"
            name="name"
            placeholder="Eben Asante"
            autoComplete="name"
            invalid={Boolean(errors.name)}
          />
        </Field>
        <Field
          label="Email address"
          htmlFor="volEmail"
          required
          error={errors.email?.[0]}
        >
          <Input
            id="volEmail"
            name="email"
            type="email"
            placeholder="eben@example.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field
          label="Phone number"
          htmlFor="volPhone"
          required
          error={errors.phone?.[0]}
          className="sm:col-span-2"
        >
          <Input
            id="volPhone"
            name="phone"
            type="tel"
            placeholder="+233 0543088817"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
          />
        </Field>
        <Field
          label="Location / Community"
          htmlFor="volLocation"
          required
          error={errors.location?.[0]}
          className="sm:col-span-2"
        >
          <Input
            id="volLocation"
            name="location"
            placeholder="Mim, Ahafo Region"
            invalid={Boolean(errors.location)}
          />
        </Field>
      </div>

      {/* Step 2 */}
      <div className="mt-9">
        <StepHeader title="Area of interest" step="2" />
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          Select all areas where you would like to contribute. These are
          expressions of interest — not guaranteed placements.
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {volunteerInterests.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <label
                key={interest}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[8px] border px-3.5 py-3 text-[12px] leading-tight transition-colors",
                  selected
                    ? "border-grass bg-mint text-ink"
                    : "border-line bg-white text-body hover:border-ink/20",
                )}
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={selected}
                  onChange={() => toggleInterest(interest)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                    selected
                      ? "border-grass bg-emblem text-white"
                      : "border-ink/20 bg-white",
                  )}
                >
                  {selected ? (
                    <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                  ) : null}
                </span>
                {interest}
              </label>
            );
          })}
        </div>
        {errors.interests?.[0] ? (
          <p className="mt-2 text-xs font-medium text-coral">
            {errors.interests[0]}
          </p>
        ) : null}
      </div>

      {/* Step 3 */}
      <div className="mt-9">
        <StepHeader title="Availability" step="3" />

        <div className="mt-4">
          <p className="text-[12px] font-medium text-ink">
            When are you available?
          </p>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {availabilityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAvailability(option)}
                aria-pressed={availability === option}
                className={cn(
                  "h-11 rounded-[8px] border text-[12px] font-medium transition-colors",
                  availability === option
                    ? "border-grass bg-emblem text-white"
                    : "border-line bg-white text-body hover:border-ink/25",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <input type="hidden" name="availability" value={availability} />
          {errors.availability?.[0] ? (
            <p className="mt-2 text-xs font-medium text-coral">
              {errors.availability[0]}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <p className="text-[12px] font-medium text-ink">
            Preferred involvement
          </p>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {involvementOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInvolvement(option)}
                aria-pressed={involvement === option}
                className={cn(
                  "h-11 rounded-[8px] border text-[12px] font-medium transition-colors",
                  involvement === option
                    ? "border-grass bg-emblem text-white"
                    : "border-line bg-white text-body hover:border-ink/25",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <input type="hidden" name="involvement" value={involvement} />
          {errors.involvement?.[0] ? (
            <p className="mt-2 text-xs font-medium text-coral">
              {errors.involvement[0]}
            </p>
          ) : null}
        </div>
      </div>

      {/* Step 4 */}
      <div className="mt-9">
        <StepHeader title="Additional information" step="4" />

        <div className="mt-5 space-y-4">
          <Field
            label="Skills / professional background"
            htmlFor="volSkills"
            error={errors.skills?.[0]}
          >
            <Input
              id="volSkills"
              name="skills"
              placeholder="e.g. Teaching, health care, carpentry"
            />
          </Field>
          <Field
            label="Why would you like to volunteer?"
            htmlFor="volMotivation"
            required
            error={errors.motivation?.[0]}
          >
            <Textarea
              id="volMotivation"
              name="motivation"
              placeholder="Tell us what motivates you to volunteer with Obroni Akunafo Kuo…"
              invalid={Boolean(errors.motivation)}
            />
          </Field>
          <Field
            label="Previous volunteering experience"
            htmlFor="volExperience"
            hint="Optional"
            error={errors.experience?.[0]}
          >
            <Textarea
              id="volExperience"
              name="experience"
              placeholder="Any previous volunteering, community work or relevant experience…"
            />
          </Field>
        </div>
      </div>

      {/* What happens next */}
      <div className="mt-7 rounded-[8px] bg-mint p-5">
        <p className="eyebrow text-forest">What happens after you apply?</p>
        <ol className="mt-4 space-y-3">
          {[
            "Submit your volunteer application using the form above",
            "The Obroni Akunafo Kuo team reviews your information",
            "A team member contacts you about suitable opportunities",
            "You receive information about next steps and how to get involved",
          ].map((step, index) => (
            <li key={step} className="flex items-start gap-2.5">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emblem text-[8px] font-bold text-white">
                {index + 1}
              </span>
              <span className="text-[11px] leading-relaxed text-body">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-grass/20 pt-3 text-[10px] leading-relaxed text-muted">
          Note: Submitting this form does not guarantee a specific volunteer
          placement.
        </p>
      </div>

      <div className="mt-4 rounded-[8px] bg-paper p-4">
        <Checkbox
          name="consent"
          required
          label="I agree that Obroni Akunafo Kuo may use the information I provide to contact me about volunteering opportunities. I understand my information will be handled with care and not shared with third parties."
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
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-emblem text-[14px] font-semibold text-white transition-colors hover:bg-forest-800 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Submitting…" : "Submit volunteer application"}
      </button>
    </form>
  );
}
