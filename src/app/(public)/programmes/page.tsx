import type { Metadata } from "next";
import Image from "next/image";
import {
  Accessibility,
  Award,
  Backpack,
  Baby,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Church,
  Code2,
  GraduationCap,
  Hammer,
  HandHeart,
  Heart,
  HeartHandshake,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  MapPin,
  MousePointer2,
  Pill,
  Repeat2,
  Search,
  Shirt,
  Stethoscope,
  Tent,
  Users,
  Utensils,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { listProgrammes } from "@/lib/data/content";
import { approach, org, programmePageOrder, type Programme } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Explore OAK's four core programmes: food support and relief, education sponsorship, healthcare support, and shelter and housing support in Ghana's Ahafo Region.",
};

const accent = {
  green: {
    text: "text-grass",
    dot: "bg-grass",
    border: "border-grass",
    chip: "bg-mint text-moss",
    pill: "border-grass/35 bg-grass/10 text-grass-bright",
    button: "primary" as const,
  },
  orange: {
    text: "text-orange",
    dot: "bg-orange",
    border: "border-orange",
    chip: "bg-orange/10 text-orange",
    pill: "border-orange/40 bg-orange/10 text-gold-bright",
    button: "orange" as const,
  },
  blue: {
    text: "text-blue",
    dot: "bg-blue",
    border: "border-blue",
    chip: "bg-blue/10 text-blue",
    pill: "border-blue/40 bg-blue/10 text-blue-bright",
    button: "blue" as const,
  },
  purple: {
    text: "text-purple-deep",
    dot: "bg-purple-deep",
    border: "border-purple-deep",
    chip: "bg-purple-deep/10 text-purple-deep",
    pill: "border-purple/40 bg-purple/10 text-violet-soft",
    button: "purple" as const,
  },
};

const programmeIcons = {
  "food-support-relief": Utensils,
  "education-sponsorship": GraduationCap,
  "healthcare-support": HeartPulse,
  "shelter-housing-support": House,
  "widow-empowerment": HandHeart,
} as const;

/** The mock labels the education, health and shelter photos in the corner. */
const labelledImages = new Set([
  "education-sponsorship",
  "healthcare-support",
  "shelter-housing-support",
]);

const bulletIcons: Record<string, (typeof Leaf)[]> = {
  "food-support-relief": [Leaf, Shirt, CalendarDays, Church, Accessibility],
  "education-sponsorship": [
    GraduationCap,
    Backpack,
    BookOpen,
    Award,
  ],
  "healthcare-support": [
    Stethoscope,
    House,
    Pill,
    Accessibility,
    HeartHandshake,
  ],
  "shelter-housing-support": [Hammer, House, Tent, MapPin],
  "widow-empowerment": [Heart, GraduationCap, Users, HeartHandshake],
};

const programmeStats: Record<
  string,
  { value?: string; label: string }[]
> = {
  "food-support-relief": [
    { value: "800+", label: "Beneficiaries reached" },
    { label: "Meals distributed (to be confirmed)" },
    { label: "Communities served (to be confirmed)" },
  ],
  "education-sponsorship": [
    { label: "Children sponsored (to be confirmed)" },
    { label: "Schools supported (to be confirmed)" },
    { label: "Avg. years supported (to be confirmed)" },
  ],
  "healthcare-support": [
    { label: "Health screenings (to be confirmed)" },
    { label: "Home visits (to be confirmed)" },
    { value: "200+", label: "PWDs supported" },
  ],
  "shelter-housing-support": [
    { label: "Homes supported (to be confirmed)" },
    { label: "Repairs completed (to be confirmed)" },
    { label: "Communities reached (to be confirmed)" },
  ],
  "widow-empowerment": [
    { label: "Widows supported (to be confirmed)" },
    { label: "Businesses started (to be confirmed)" },
    { label: "Savings groups (to be confirmed)" },
  ],
};

const beneficiaryGroups = [
  {
    title: "Widows",
    body: "Women who have lost their husbands and face economic and social vulnerability without family support.",
    icon: HandHeart,
    tone: "text-gold",
  },
  {
    title: "Orphans",
    body: "Children who have lost one or both parents and need educational and emotional support to build their future.",
    icon: Baby,
    tone: "text-gold",
  },
  {
    title: "Persons With Disabilities",
    body: "Over 200 PWDs across the Ahafo Region — added to our programmes in 2023 as part of our community inclusion commitment.",
    icon: Accessibility,
    tone: "text-blue-bright",
  },
  {
    title: "The Aged",
    body: "Elderly community members who need companionship, healthcare access and daily support to live with dignity.",
    icon: Users,
    tone: "text-gold",
  },
];

const approachIcons = [Search, Code2, MousePointer2, Repeat2];

const heading2 =
  "text-[clamp(1.5rem,2.2vw,1.875rem)] font-semibold leading-[1.15] tracking-[-0.02em]";

export default async function ProgrammesPage() {
  const programmes = await listProgrammes();
  const orderedProgrammes = programmePageOrder
    .map((slug) => programmes.find((programme) => programme.slug === slug))
    .filter((programme): programme is Programme => Boolean(programme));

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-oak py-14 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-grass/30 bg-grass/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-grass-bright">
                <span className="size-1.5 rounded-full bg-grass-bright" />4 core
                programmes · Ahafo Region &amp; beyond
              </span>

              <h1 className="mt-6 max-w-[17ch] text-[clamp(2.25rem,4.1vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
                Programmes built on{" "}
                <span className="text-lime">compassion and action</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
                Every programme we run is rooted in our founding mission — to
                restore dignity, hope and sustainable livelihoods to the most
                vulnerable members of our communities.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {orderedProgrammes.map((programme) => {
                  const Icon =
                    programmeIcons[
                      programme.slug as keyof typeof programmeIcons
                    ] ?? Utensils;
                  return (
                    <a
                      key={programme.slug}
                      href={`#${programme.slug}`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:brightness-125",
                        accent[programme.accent].pill,
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {programme.category}
                    </a>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[11px] text-white/45">
                {[
                  "800–1,000 beneficiaries",
                  "200+ PWDs",
                  `Founded ${org.founded}`,
                  "Mim, Ahafo Region",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-lime" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-[18px] border border-white/10 bg-white/[0.035] p-6 sm:p-7 lg:justify-self-end">
              <p className="eyebrow text-white/40">
                Programme impact at a glance
              </p>
              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] bg-white/10">
                {[
                  { value: "800+", label: "Beneficiaries supported" },
                  { value: "200+", label: "PWDs across Ahafo" },
                  { value: "4", label: "Core programme areas" },
                  { value: "10yr", label: "Of community service" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-ink-soft p-6">
                    <p className="text-2xl font-semibold text-grass">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-white/45">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[10px] leading-relaxed text-white/30">
                Numbers as reported by the organisation. Specific programme
                figures will be updated once confirmed by Obroni Akunafo Kuo.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-line bg-white">
        <div className="container-oak flex items-center justify-between gap-4 overflow-x-auto">
          {orderedProgrammes.map((programme, index) => (
            <a
              key={programme.slug}
              href={`#${programme.slug}`}
              className={cn(
                "-mb-px flex shrink-0 items-center gap-2.5 whitespace-nowrap border-b-2 px-6 py-5 text-[15px] font-medium transition-colors",
                index === 0
                  ? cn(accent[programme.accent].border, "text-ink")
                  : "border-transparent text-body hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  accent[programme.accent].dot,
                )}
              />
              {programme.category}
            </a>
          ))}
        </div>
      </div>

      {/* Programme sections */}
      {orderedProgrammes.map((programme, index) => {
        const a = accent[programme.accent];
        const icons = bulletIcons[programme.slug] ?? [];
        const stats = programmeStats[programme.slug] ?? [];
        const ProgrammeIcon =
          programmeIcons[programme.slug as keyof typeof programmeIcons] ??
          Heart;
        const imageFirst = index % 2 === 0;

        return (
          <section
            key={programme.slug}
            id={programme.slug}
            className={cn(
              "scroll-mt-24 py-16 sm:py-20 lg:py-24",
              index % 2 === 0 ? "bg-white" : "bg-paper",
            )}
          >
            <div className="container-oak grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div
                className={cn(
                  "flex flex-col",
                  !imageFirst && "lg:order-2",
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-mint">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    sizes="(min-width: 1024px) 600px, 90vw"
                    className="object-cover"
                  />
                  {labelledImages.has(programme.slug) ? (
                    <span className="absolute left-3 top-3 rounded-[6px] bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
                      {programme.category} programme
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[10px] border border-line bg-white p-3.5"
                    >
                      <p
                        className={cn(
                          "text-lg font-semibold leading-none",
                          a.text,
                        )}
                      >
                        {stat.value ?? "—"}
                      </p>
                      <p className="mt-1.5 text-[10px] leading-snug text-muted">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "flex flex-col justify-center",
                  !imageFirst && "lg:order-1",
                )}
              >
                <p className={cn("eyebrow", a.text)}>
                  Programme {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className={cn("mt-4", heading2)}>{programme.title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-body">
                  {programme.description}
                </p>

                <ul className="mt-6 flex flex-col gap-4">
                  {programme.bullets.map((bullet, i) => {
                    const Icon = icons[i] ?? CheckCircle2;
                    return (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-[13px] leading-relaxed text-body"
                      >
                        <span
                          className={cn(
                            "mt-px flex size-7 shrink-0 items-center justify-center rounded-[8px]",
                            a.chip,
                          )}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                        </span>
                        <span className="pt-1">{bullet}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-7">
                  <ButtonLink
                    href={`/donate?programme=${programme.slug}`}
                    variant={a.button}
                  >
                    <ProgrammeIcon className="size-4" aria-hidden="true" />
                    {programme.cta}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Beneficiary groups */}
      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="container-oak grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {beneficiaryGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.title}
                className="flex flex-col items-center px-4 text-center lg:border-l lg:border-white/10 lg:px-8 lg:first:border-l-0"
              >
                <Icon
                  className={cn("size-7", group.tone)}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {group.title}
                </h3>
                <p className="mt-2 max-w-[30ch] text-[12px] leading-relaxed text-white/45">
                  {group.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Approach */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow tone="green">Our approach</Eyebrow>
          <h2 className={cn("mt-4", heading2)}>How we work in the community</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-body">
            Our programmes succeed because they are deeply rooted in community
            relationships, not external interventions.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((step, index) => {
              const Icon = approachIcons[index] ?? Search;
              return (
                <article
                  key={step.step}
                  className="rounded-[14px] border border-line bg-white p-6"
                >
                  <span className="block text-[28px] font-semibold leading-none text-ink/10">
                    {step.step}
                  </span>
                  <span
                    className={cn(
                      "mt-4 flex size-9 items-center justify-center rounded-[10px]",
                      index % 2 === 0
                        ? "bg-mint text-moss"
                        : "bg-amber/10 text-amber",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {step.body}
                  </p>
                </article>
              );
            })}
          </div>

          <figure className="mt-10 rounded-[18px] bg-forest p-8 text-white sm:p-10">
            <span className="text-4xl leading-none text-grass/50">&ldquo;</span>
            <blockquote className="mt-2 max-w-3xl text-lg italic leading-relaxed text-white/85">
              The organisation came to our community when no one else did. They
              brought food, they paid my grandchildren&apos;s school fees, and
              they never made us feel like a burden. They truly are each
              other&apos;s keeper.
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-forest">
                CB
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  Community beneficiary — Ahafo Region
                </span>
                <span className="block text-[11px] text-white/45">
                  Food Support &amp; Education Programme
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 text-center text-white sm:py-20">
        <div className="container-oak">
          <Eyebrow tone="dark" className="justify-center text-grass">
            Support our programmes
          </Eyebrow>
          <h2 className={cn("mx-auto mt-4 max-w-xl", heading2)}>
            Every contribution funds real change
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Whether you donate, volunteer or partner with us — your involvement
            directly supports these four programmes and the people who depend
            on them.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/donate">
              <Heart className="size-4" aria-hidden="true" />
              Donate now
            </ButtonLink>
            <ButtonLink href="/volunteer" variant="outline-dark">
              <Users className="size-4" aria-hidden="true" />
              Become a volunteer
            </ButtonLink>
            <ButtonLink href="/partner" variant="outline-dark">
              <Landmark className="size-4" aria-hidden="true" />
              Partner with us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
