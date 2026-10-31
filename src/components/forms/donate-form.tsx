"use client";

import { useActionState, useState } from "react";
import {
  AlertTriangle,
  Check,
  Heart,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { submitDonation } from "@/app/actions";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/validation";

export type PaymentDetails = {
  momoNumber: string;
  momoName: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
};

const initialState: FormState = { ok: false };

const presets = [50, 100, 250, 500, 1000, 5000] as const;

const steps = [
  { n: 1, label: "Amount", target: "step-amount" },
  { n: 2, label: "Your details", target: "step-details" },
  { n: 3, label: "Payment", target: "step-payment" },
  { n: 4, label: "Confirm", target: "step-confirm" },
] as const;

function money(value: number) {
  return `GH₵ ${value.toLocaleString("en-GH", {
    maximumFractionDigits: 2,
  })}`;
}

function spaced(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10) return value;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function StepHeader({ title, step }: { title: string; step: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {title}
      </h2>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emblem">
        {step}
      </span>
    </div>
  );
}

export function DonateForm({ payment }: { payment: PaymentDetails }) {
  const [state, action, pending] = useActionState(
    submitDonation,
    initialState,
  );
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [preset, setPreset] = useState<number | null>(250);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"momo" | "bank">("momo");
  const [activeStep, setActiveStep] = useState(1);

  const amount = custom ? Number(custom) || 0 : (preset ?? 0);
  const errors = state.errors ?? {};

  function scrollTo(target: string, step: number) {
    setActiveStep(step);
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <form action={action}>
      <input type="hidden" name="frequency" value={frequency} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="method" value={method} />

      {/* Stepper */}
      <div className="border-y border-line bg-white">
        <div className="container-oak flex items-center justify-center gap-1 py-5 sm:gap-4">
          {steps.map((step, index) => {
            const isActive = activeStep === step.n;
            const isDone = activeStep > step.n;
            return (
              <div key={step.n} className="flex items-center gap-1 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo(step.target, step.n)}
                  className="flex flex-col items-center gap-2"
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border text-[12px] font-semibold transition-colors",
                      isActive &&
                        "border-emblem bg-emblem text-white",
                      isDone &&
                        !isActive &&
                        "border-emblem/40 bg-white text-emblem",
                      !isActive &&
                        !isDone &&
                        "border-line bg-white text-muted",
                    )}
                  >
                    {isDone ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : (
                      step.n
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[10.5px] font-medium",
                      isActive ? "text-emblem" : "text-muted",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 ? (
                  <span
                    className={cn(
                      "mb-5 h-px w-8 sm:w-16",
                      activeStep > step.n ? "bg-emblem/40" : "bg-line",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white">
        <div className="container-oak grid gap-10 py-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            {/* Step 1 — frequency */}
            <section id="step-amount" className="scroll-mt-28">
              <StepHeader title="Giving frequency" step="Step 1" />
              <div
                className="mt-4 grid grid-cols-2 gap-1 rounded-[8px] border border-line bg-paper p-1"
                onFocusCapture={() => setActiveStep(1)}
              >
                {[
                  { value: "once" as const, label: "Give once" },
                  { value: "monthly" as const, label: "Give monthly" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFrequency(option.value)}
                    className={cn(
                      "h-11 rounded-[6px] text-[13.5px] transition-colors",
                      frequency === option.value
                        ? "bg-white font-semibold text-emblem shadow-sm"
                        : "text-body hover:text-ink",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                Monthly giving ensures ongoing support for our beneficiaries
                throughout the year.
              </p>
            </section>

            {/* Step 2 — amount */}
            <section className="mt-9 scroll-mt-28" id="step-amount-cards">
              <StepHeader title="Choose an amount" step="Step 2" />
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {presets.map((value) => {
                  const selected = !custom && preset === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setPreset(value);
                        setCustom("");
                        setActiveStep(1);
                      }}
                      className={cn(
                        "rounded-[8px] border px-3 py-4 text-center transition-colors",
                        selected
                          ? "border-emblem bg-emblem text-white"
                          : "border-line bg-white text-ink hover:border-emblem/40",
                      )}
                    >
                      <span className="block text-[16px] font-medium">
                        {money(value)}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-[10.5px]",
                          selected ? "text-white/75" : "text-muted",
                        )}
                      >
                        {selected
                          ? "Selected"
                          : frequency === "once"
                            ? "One-time"
                            : "Monthly"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <label
                htmlFor="custom-amount"
                className="mt-5 block text-[11px] text-muted"
              >
                Or enter a custom amount
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-muted">
                  GH₵
                </span>
                <input
                  id="custom-amount"
                  inputMode="decimal"
                  value={custom}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d.]/g, "");
                    setCustom(value);
                    setActiveStep(1);
                  }}
                  placeholder="enter an amount"
                  className="h-12 w-full rounded-[8px] border border-line bg-white pl-14 pr-4 text-[13px] text-ink placeholder:text-muted/60 focus:border-emblem focus:outline-none focus:ring-2 focus:ring-emblem/15"
                />
              </div>
              {errors.amount?.[0] ? (
                <p className="mt-2 text-xs font-medium text-coral">
                  {errors.amount[0]}
                </p>
              ) : null}
            </section>

            {/* Step 3 — details */}
            <section
              id="step-details"
              className="mt-9 scroll-mt-28"
              onFocusCapture={() => setActiveStep(2)}
            >
              <StepHeader title="Your information" step="Step 3" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  htmlFor="donorName"
                  required
                  error={errors.donorName?.[0]}
                >
                  <Input
                    id="donorName"
                    name="donorName"
                    placeholder="Sarah Mensah"
                    autoComplete="name"
                    invalid={Boolean(errors.donorName)}
                  />
                </Field>
                <Field
                  label="Email address (optional)"
                  htmlFor="donorEmail"
                  error={errors.email?.[0]}
                >
                  <Input
                    id="donorEmail"
                    name="email"
                    type="email"
                    placeholder="sarahmensah@gmail.com"
                    autoComplete="email"
                    invalid={Boolean(errors.email)}
                  />
                </Field>
                <Field
                  label="Phone number"
                  htmlFor="donorPhone"
                  required
                  className="sm:col-span-2"
                  error={errors.phone?.[0]}
                >
                  <Input
                    id="donorPhone"
                    name="phone"
                    type="tel"
                    placeholder="+233 0543088817"
                    autoComplete="tel"
                    invalid={Boolean(errors.phone)}
                  />
                </Field>
                <Field
                  label="Message (optional)"
                  htmlFor="donorMessage"
                  className="sm:col-span-2"
                >
                  <Textarea
                    id="donorMessage"
                    name="message"
                    placeholder="Add a message with your donation"
                    className="min-h-28"
                  />
                </Field>
              </div>
            </section>

            {/* Step 4 — payment */}
            <section
              id="step-payment"
              className="mt-9 scroll-mt-28"
              onFocusCapture={() => setActiveStep(3)}
            >
              <StepHeader title="Payment method" step="Step 4" />

              <div className="mt-4 grid grid-cols-2 gap-1 rounded-[8px] border border-line bg-paper p-1">
                {[
                  {
                    value: "momo" as const,
                    label: "Mobile Money",
                    icon: Smartphone,
                  },
                  {
                    value: "bank" as const,
                    label: "Bank Transfer",
                    icon: Landmark,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMethod(option.value)}
                      className={cn(
                        "flex h-11 items-center justify-center gap-2 rounded-[6px] text-[13px] transition-colors",
                        method === option.value
                          ? "bg-white font-semibold text-ink shadow-sm"
                          : "text-body hover:text-ink",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {method === "momo" ? (
                <div className="mt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    MTN Mobile Money
                  </p>
                  <div className="mt-2 flex items-center gap-4 rounded-[8px] border border-line bg-white p-4">
                    <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-[6px] bg-gold text-[8px] font-bold leading-tight text-ink">
                      <span className="text-[12px]">MTN</span>
                      MoMo
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted">Send to</p>
                      <p className="text-lg font-semibold tracking-wide text-ink">
                        {payment.momoNumber}
                      </p>
                      <p className="text-[11px] text-muted">
                        Account name: {payment.momoName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[10px] bg-mint p-5">
                    <p className="text-[13px] font-medium leading-snug text-emblem">
                      How to send via MTN MoMo
                    </p>
                    <ol className="mt-4 space-y-3.5">
                      {[
                        <>
                          Dial <strong>*170#</strong> on your phone or open your
                          MTN MoMo app
                        </>,
                        <>
                          Select <strong>Transfer Money</strong> →{" "}
                          <strong>To MoMo User</strong>
                        </>,
                        <>
                          Enter number{" "}
                          <strong>{spaced(payment.momoNumber)}</strong>
                        </>,
                        <>
                          Enter amount{" "}
                          <strong>{money(amount || 0)}</strong>
                        </>,
                        <>
                          Confirm <strong>{payment.momoName}</strong> before
                          sending
                        </>,
                      ].map((content, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-[11px] leading-relaxed text-body"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emblem text-[9px] font-bold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{content}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Bank transfer — {payment.bankName}
                  </p>
                  <div className="mt-2 rounded-[8px] border border-line bg-white p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-[6px] bg-emblem text-[11px] font-bold text-white">
                        {payment.bankName.slice(0, 3).toUpperCase()}
                      </span>
                      <p className="text-[15px] font-medium text-ink">
                        {payment.bankName}
                      </p>
                    </div>
                    <dl className="mt-4 space-y-3 text-[11.5px]">
                      {[
                        ["Account name", payment.bankAccountName],
                        ["Account number", payment.bankAccountNumber],
                        ["Bank", payment.bankName],
                        ["Currency", "Ghana Cedis (GHS)"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-start justify-between gap-4 border-b border-line/70 pb-2.5 last:border-0 last:pb-0"
                        >
                          <dt className="text-[10px] uppercase tracking-[0.1em] text-muted">
                            {label}
                          </dt>
                          <dd className="text-right font-semibold text-ink">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="mt-4 rounded-[10px] border border-amber/50 bg-[#FFF4E5] p-5">
                    <p className="flex items-center gap-2 text-[12px] font-semibold text-coral">
                      <AlertTriangle className="size-4" aria-hidden="true" />
                      Important — please verify before sending
                    </p>
                    <p className="mt-3 text-[11.5px] leading-relaxed text-coral">
                      Always confirm the account name reads{" "}
                      <strong>{payment.bankAccountName}</strong> before completing
                      your transfer. After sending, please fill in your details
                      above so we can confirm receipt and issue your
                      acknowledgement.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Consent + submit */}
            <section id="step-confirm" className="mt-8 scroll-mt-28">
              <div className="rounded-[8px] bg-paper p-4">
                <Checkbox
                  name="consent"
                  required
                  label="I agree to Obroni Akunafo Kuo's privacy policy and understand that my donation will be used to support Obroni Akunafo Kuo's community programmes."
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
                onClick={() => setActiveStep(4)}
                className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-[8px] bg-lime py-3.5 text-[15px] font-semibold text-forest transition-colors hover:bg-grass hover:text-white disabled:pointer-events-none disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Heart className="size-4" aria-hidden="true" />
                )}
                {pending
                  ? "Saving…"
                  : `Confirm donation details${amount ? ` — ${money(amount)}` : ""}`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted">
                <Lock className="size-3" aria-hidden="true" />
                No card payment is taken on this site. Your details are kept
                private.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[10px] border border-line bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Donation summary
              </p>
              <dl className="mt-4 space-y-3 text-[12px]">
                <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-2.5">
                  <dt className="text-muted">Amount</dt>
                  <dd className="font-semibold text-ink">
                    {money(amount || 0)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-2.5">
                  <dt className="text-muted">Frequency</dt>
                  <dd className="font-semibold text-ink">
                    {frequency === "once" ? "One-time" : "Monthly"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-2.5">
                  <dt className="text-muted">Organisation</dt>
                  <dd className="font-semibold text-ink">Obroni Akunafo Kuo</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-2.5">
                  <dt className="text-muted">Payment</dt>
                  <dd className="font-semibold text-ink">
                    {method === "momo" ? "MTN MoMo" : payment.bankName}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1">
                  <dt className="text-[12px] font-medium text-ink">Total</dt>
                  <dd className="text-xl font-semibold text-emblem">
                    {money(amount || 0)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 rounded-[10px] bg-emblem p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                Your donation supports
              </p>
              <p className="mt-2 text-[14px] font-semibold">
                Real people in your community
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Widows in vulnerable households",
                  "Orphans and children in need",
                  "Persons with Disabilities",
                  "The aged and elderly",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[11px] text-white/80"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-lime" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/15 pt-3 text-[10.5px] leading-relaxed text-white/60">
                Through food relief, healthcare access, education support and
                community empowerment programmes.
              </p>
            </div>

            <div className="mt-4 rounded-[10px] border border-line bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                About Obroni Akunafo Kuo
              </p>
              <p className="mt-2.5 text-[10.5px] leading-relaxed text-muted">
                A non-profit, non-partisan and non-discriminatory organisation
                founded in 2016 to support vulnerable community members.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["800+", "Beneficiaries supported"],
                  ["200+", "Persons With Disabilities"],
                  ["2016", "Year founded"],
                  ["Annual", "Independent audit"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[6px] bg-paper p-3">
                    <p className="text-[15px] font-semibold text-emblem">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[9.5px] leading-snug text-muted">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[10px] border border-line bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Why trust us
              </p>
              <ul className="mt-4 space-y-3.5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Annually audited",
                    body: "Independent financial audit conducted each year for full transparency.",
                  },
                  {
                    icon: Users,
                    title: "Governance structure",
                    body: "An independent board provides oversight of all financial decisions.",
                  },
                  {
                    icon: Heart,
                    title: "Non-partisan",
                    body: "We serve all beneficiaries without political, religious or ethnic discrimination.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-mint text-emblem">
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold text-ink">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-relaxed text-muted">
                          {item.body}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </form>
  );
}
