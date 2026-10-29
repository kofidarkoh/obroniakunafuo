import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  GraduationCap,
  Heart,
  Sprout,
  Users,
} from "lucide-react";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { LogoMark } from "@/components/site/logo";
import { Eyebrow } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Be part of a community that cares. Volunteer with Obroni Akunafo Kuo and help support widows, orphans, persons with disabilities and the aged in Ghana.",
};

const whyVolunteer = [
  {
    icon: Users,
    title: "Community outreach",
    body: "Support community activities and outreach programmes reaching vulnerable households.",
    tone: "mint",
  },
  {
    icon: GraduationCap,
    title: "Education support",
    body: "Help support educational activities for vulnerable children and young people in our communities.",
    tone: "amber",
  },
  {
    icon: Sprout,
    title: "Skills & empowerment",
    body: "Contribute professional or practical skills to empowerment and livelihood initiatives.",
    tone: "mint",
  },
  {
    icon: Heart,
    title: "Companionship & care",
    body: "Support activities involving the aged and other vulnerable groups who benefit from human connection.",
    tone: "amber",
  },
] as const;

const progress = [
  { label: "Personal information", state: "done" },
  { label: "Area of interest", state: "done" },
  { label: "Availability", state: "done" },
  { label: "Additional info", state: "current" },
  { label: "Submit", state: "upcoming" },
] as const;

export default function VolunteerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-white">
        <div className="container-oak grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-grass/40 px-4 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-grass">
              <Heart className="size-3" aria-hidden="true" />
              Join our volunteer community
            </span>

            <h1 className="mt-5 max-w-lg text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
              Be part of a{" "}
              <span className="text-lime">community</span> that cares.
            </h1>

            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/60">
              Volunteers are the heart of everything we do. Contribute your
              time, skills and compassion to support the most vulnerable members
              of our communities.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Widows", "Orphans", "Persons with Disabilities", "The Aged"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/15 px-3.5 py-1.5 text-[10.5px] text-white/70"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[10px] text-white/45">
              {[
                "Founded 2016",
                "800–1,000 beneficiaries",
                "Non-partisan organisation",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-lime" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] bg-white p-6 text-center text-ink">
            <Image
              src="/images/oak-logo.png"
              alt="Obroni Akunafo Kuo emblem"
              width={240}
              height={240}
              className="mx-auto size-44 object-contain sm:size-52"
            />
            <p className="mt-4 text-lg font-semibold tracking-tight">
              Obroni Akunafo Kuo
            </p>
            <p className="mt-1 text-[10.5px] text-muted">
              Motto: Obaa Kunani — Awurade Ne Me Boafo
            </p>
          </div>
        </div>
      </section>

      {/* Why volunteer */}
      <section className="bg-white py-14 sm:py-16">
        <div className="container-oak">
          <Eyebrow>Why volunteer?</Eyebrow>
          <h2 className="display-2 mt-3">How you can make a difference</h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-body">
            Volunteers contribute in many ways — from outreach to education,
            from professional skills to simply spending time with those who need
            companionship.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyVolunteer.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[10px] border border-line bg-paper p-5"
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-[6px] ${
                      item.tone === "mint"
                        ? "bg-mint text-moss"
                        : "bg-amber/10 text-amber"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[14px] font-medium leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="bg-paper py-12 sm:py-14">
        <div className="container-oak grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <VolunteerForm />

          <aside className="space-y-4">
            <div className="rounded-[10px] bg-white p-5">
              <p className="eyebrow text-muted">About the organisation</p>
              <div className="mt-4 flex items-center gap-3 border-b border-line pb-4">
                <LogoMark className="size-10" />
                <div>
                  <p className="text-[12.5px] font-semibold text-ink">
                    Obroni Akunafo Kuo
                  </p>
                  <p className="text-[9px] text-muted">
                    Founded 2016 · Non-profit NGO
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[10.5px] leading-relaxed text-muted">
                A non-partisan, non-discriminatory organisation supporting
                vulnerable community members through direct programmes and
                community outreach.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[6px] bg-paper p-3">
                  <p className="text-lg font-semibold text-grass">800+</p>
                  <p className="mt-0.5 text-[9px] leading-tight text-muted">
                    Beneficiaries supported
                  </p>
                </div>
                <div className="rounded-[6px] bg-paper p-3">
                  <p className="text-lg font-semibold text-grass">200+</p>
                  <p className="mt-0.5 text-[9px] leading-tight text-muted">
                    PWDs supported
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-forest p-5 text-white">
              <p className="eyebrow text-grass">You&apos;ll be supporting</p>
              <p className="mt-3 text-[12px] font-medium">
                Real people who need you
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Widows in vulnerable households",
                  "Orphans and children in need",
                  "Persons with Disabilities",
                  "The aged and elderly",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[10.5px] leading-relaxed text-white/65"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-lime" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/10 pt-3 text-[9.5px] leading-relaxed text-white/40">
                Through food relief, healthcare, education support and community
                empowerment.
              </p>
            </div>

            <div className="rounded-[10px] bg-white p-5">
              <p className="eyebrow text-muted">Your progress</p>
              <ol className="mt-4">
                {progress.map((item, index) => (
                  <li key={item.label} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < progress.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[9px] top-5 h-full w-px bg-line"
                      />
                    ) : null}
                    <span
                      className={`relative z-10 flex size-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                        item.state === "done"
                          ? "bg-grass text-white"
                          : item.state === "current"
                            ? "border border-ink/20 bg-white text-muted"
                            : "border border-line bg-white text-muted/60"
                      }`}
                    >
                      {item.state === "done" ? (
                        <Check className="size-2.5" strokeWidth={3} />
                      ) : item.state === "current" ? (
                        index + 1
                      ) : (
                        <Check className="size-2.5" />
                      )}
                    </span>
                    <span
                      className={`text-[10.5px] ${
                        item.state === "current"
                          ? "font-medium text-ink"
                          : "text-muted"
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Validation states */}
      <section className="border-t border-line bg-paper py-12">
        <div className="container-oak">
          <Eyebrow>Form validation states</Eyebrow>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-muted">
            Clear feedback at every interaction — default, focused, error and
            success states applied consistently across all form fields.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[8px] border border-line bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                Default state
              </p>
              <p className="mt-3 text-[10.5px] font-medium text-ink">
                Email address
              </p>
              <div className="mt-1.5 flex h-9 items-center rounded-[6px] border border-line px-3 text-[11px] text-muted/60">
                Enter your email accounts
              </div>
              <p className="mt-2 text-[9.5px] leading-relaxed text-muted">
                Clean, clear label. Placeholder guides input.
              </p>
            </div>

            <div className="rounded-[8px] border border-line bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                Focused state
              </p>
              <p className="mt-3 text-[10.5px] font-medium text-ink">
                Email address
              </p>
              <div className="mt-1.5 flex h-9 items-center rounded-[6px] border border-grass px-3 text-[11px] text-ink ring-2 ring-grass/15">
                eben@example.com
              </div>
              <p className="mt-2 text-[9.5px] leading-relaxed text-muted">
                Green border + soft ring. Active field unmistakable.
              </p>
            </div>

            <div className="rounded-[8px] border border-line bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                Error state
              </p>
              <p className="mt-3 text-[10.5px] font-medium text-ink">
                Email address
              </p>
              <div className="mt-1.5 flex h-9 items-center rounded-[6px] border border-coral bg-coral/[0.06] px-3 text-[11px] text-ink">
                eben@@.com
              </div>
              <p className="mt-2 text-[9.5px] font-medium text-coral">
                Please enter a valid email address.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
