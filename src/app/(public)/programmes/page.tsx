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
  GraduationCap,
  Hammer,
  HandHeart,
  Heart,
  HeartHandshake,
  House,
  Landmark,
  Leaf,
  MapPin,
  Pill,
  Repeat2,
  Search,
  Shirt,
  Stethoscope,
  Tent,
  Users,
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
    button: "primary" as const,
  },
  orange: {
    text: "text-orange",
    dot: "bg-orange",
    border: "border-orange",
    button: "orange" as const,
  },
  blue: {
    text: "text-blue",
    dot: "bg-blue",
    border: "border-blue",
    button: "blue" as const,
  },
  purple: {
    text: "text-purple-deep",
    dot: "bg-purple-deep",
    border: "border-purple-deep",
    button: "purple" as const,
  },
};

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
  "widow-empowerment": [HandHeart, GraduationCap, Users, HeartHandshake],
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
    tone: "bg-gold/15 text-gold",
  },
  {
    title: "Orphans",
    body: "Children who have lost one or both parents and need educational and emotional support to build their future.",
    icon: Baby,
    tone: "bg-gold/15 text-gold",
  },
  {
    title: "Persons With Disabilities",
    body: "Over 200 PWDs across the Ahafo Region — added to our programmes in 2023 as part of our community inclusion commitment.",
    icon: Accessibility,
    tone: "bg-blue/15 text-blue",
  },
  {
    title: "The Aged",
    body: "Elderly community members who need companionship, healthcare access and daily support to live with dignity.",
    icon: Users,
    tone: "bg-gold/15 text-gold",
  },
];

const approachIcons = [Search, Repeat2, HandHeart, Repeat2];

export default async function ProgrammesPage() {
  const programmes = await listProgrammes();
  const orderedProgrammes = programmePageOrder
    .map((slug) => programmes.find((programme) => programme.slug === slug))
    .filter((programme): programme is Programme => Boolean(programme));

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-oak py-12 sm:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                <span className="size-1.5 rounded-full bg-lime" />4 core
                programmes · Ahafo Region &amp; beyond
              </span>

              <h1 className="display-1 mt-6 max-w-[14ch]">
                Programmes built on{" "}
                <span className="text-lime">compassion and action</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
                Every programme we run is rooted in our founding mission — to
                restore dignity, hope and sustainable livelihoods to the most
                vulnerable members of our communities.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {orderedProgrammes.map((programme) => (
                  <a
                    key={programme.slug}
                    href={`#${programme.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/75 transition-colors hover:border-white/35"
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        accent[programme.accent].dot,
                      )}
                    />
                    {programme.shortTitle}
                  </a>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/45">
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
                  <div key={stat.label} className="bg-ink-soft p-5">
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
        <div className="container-oak flex gap-8 overflow-x-auto">
          {orderedProgrammes.map((programme, index) => (
            <a
              key={programme.slug}
              href={`#${programme.slug}`}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 py-4 text-[13px] font-medium transition-colors",
                index === 0
                  ? cn(accent[programme.accent].border, "text-ink")
                  : "border-transparent text-body hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
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
        const imageFirst = index % 2 === 0;

        return (
          <section
            key={programme.slug}
            id={programme.slug}
            className={cn(
              "scroll-mt-24 py-16 sm:py-20",
              index % 2 === 0 ? "bg-paper" : "bg-white",
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
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[10px] border border-line bg-white p-3.5"
                    >
                      {stat.value ? (
                        <p
                          className={cn(
                            "text-lg font-semibold",
                            a.text,
                          )}
                        >
                          {stat.value}
                        </p>
                      ) : null}
                      <p
                        className={cn(
                          "text-[10px] leading-snug text-muted",
                          stat.value && "mt-1",
                        )}
                      >
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
                <h2 className="display-2 mt-4">{programme.title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-body">
                  {programme.description}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {programme.bullets.map((bullet, i) => {
                    const Icon = icons[i] ?? CheckCircle2;
                    return (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-[13px] leading-relaxed text-body"
                      >
                        <Icon
                          className={cn("mt-0.5 size-4 shrink-0", a.text)}
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-7">
                  <ButtonLink
                    href={`/donate?programme=${programme.slug}`}
                    variant={a.button}
                  >
                    <Heart className="size-4" aria-hidden="true" />
                    {programme.cta}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Beneficiary groups */}
      <section className="bg-ink py-14 text-white sm:py-16">
        <div className="container-oak grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {beneficiaryGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.title}
                className="lg:border-l lg:border-white/10 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    group.tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {group.title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-white/45">
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
          <h2 className="display-2 mt-4">How we work in the community</h2>
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
                  className="relative overflow-hidden rounded-[14px] border border-line bg-white p-6"
                >
                  <span className="pointer-events-none absolute right-4 top-3 text-4xl font-semibold text-grass/10">
                    {step.step}
                  </span>
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-[10px]",
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
                  Food support · Widows · Small-scale farming
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
          <h2 className="display-2 mx-auto mt-4 max-w-xl">
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
