import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  FileCheck2,
  FileText,
  Heart,
  Landmark,
  Lock,
  Quote,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ButtonLink } from "@/components/ui/button";
import {
  Eyebrow,
  IconTile,
  SectionHeading,
} from "@/components/ui/primitives";
import {
  homeProgrammeOrder,
  impactStats,
  leadership,
  org,
  testimonials,
  trustPoints,
  type Programme,
} from "@/lib/site";
import { listProgrammes, listStories } from "@/lib/data/content";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Restoring hope, dignity and love",
  description:
    "Obroni Akunafo Kuo supports widows, orphans, persons with disabilities and the aged in Ghana's Ahafo Region through food relief, education, healthcare and empowerment.",
  alternates: { canonical: "/" },
};

const accentText: Record<string, string> = {
  green: "text-grass",
  orange: "text-orange",
  blue: "text-blue",
  purple: "text-purple-deep",
};

const accentDot: Record<string, string> = {
  green: "bg-grass",
  orange: "bg-orange",
  blue: "bg-blue",
  purple: "bg-purple-deep",
};

const trustCards = [
  {
    icon: FileText,
    title: "Annual audits",
    body: "Fully audited financial statements published each year — every cedi accounted for.",
    link: "Download 2024 report",
    href: "/stories#impact",
  },
  {
    icon: BadgeCheck,
    title: "Registered & compliant",
    body: "Registered with the Ghana NGO Authority. Registration No. CG024292019. Fully compliant.",
    link: "View registration",
    href: "/about#governance",
  },
  {
    icon: UserRound,
    title: "Governance structure",
    body: "Board of Trustees + Executive Council + General Assembly.",
    link: "Meet the board",
    href: "/about#leadership",
  },
  {
    icon: BarChart3,
    title: "Financial accountability",
    body: "Donations, grants, fundraising and dues are identified as funding sources, with a bank account requiring two signatories.",
    link: "View impact data",
    href: "/stories#impact",
  },
];

const trustIcons = {
  "shield-check": ShieldCheck,
  lock: Lock,
  "file-check": FileCheck2,
  "badge-check": BadgeCheck,
} as const;

export default async function HomePage() {
  const programmes = await listProgrammes();
  const featuredProgrammes = homeProgrammeOrder
    .map((slug) => programmes.find((programme) => programme.slug === slug))
    .filter((programme): programme is Programme => Boolean(programme));
  const latestStories = (await listStories()).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green text-white">
<div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_78%_10%,#2A7C13_0%,#133c08_40%,#091f04_70%,#030b01_100%)]" /> 
<div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 size-[420px] rounded-full bg-lime-500/10 blur-[120px]" />


        <div className="container-oak relative py-12 sm:py-14 lg:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                <span className="size-1.5 rounded-full bg-lime" />
                Registered NGO — Ghana {org.founded}
              </span>

              <h1 className="display-1 mt-6 max-w-[15ch] text-white">
                Restoring hope, dignity and love to vulnerable communities.
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-base">
                We support widows, orphans, persons with disabilities and the
                aged through compassionate care, education, healthcare and
                empowerment.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/donate" variant="lime" size="lg">
                  <Heart className="size-4" aria-hidden="true" />
                  Donate now
                </ButtonLink>
                <ButtonLink
                  href="/volunteer"
                  variant="outline-light"
                  size="lg"
                >
                  <Users className="size-4" aria-hidden="true" />
                  Become a volunteer
                </ButtonLink>
                <ButtonLink
                  href="/partner"
                  variant="outline-light"
                  size="lg"
                  className="hidden sm:inline-flex"
                >
                  <Landmark className="size-4" aria-hidden="true" />
                  Partner with us
                </ButtonLink>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[400px] lg:mx-0 lg:justify-self-end">
              <HeroCarousel />
            </div>
          </div>

          <div className="mt-12 grid gap-3 border-t border-white/10 pt-6 text-[11px] text-white/60 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {trustPoints.map((point) => {
              const Icon =
                trustIcons[point.icon as keyof typeof trustIcons] ?? ShieldCheck;
              return (
                <span key={point.title} className="flex items-center gap-2">
                  <Icon className="size-3.5 text-lime" aria-hidden="true" />
                  {point.title}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Measurable impact</Eyebrow>
              <h2 className="display-2 mt-4">Real outcomes, real people</h2>
            </div>
            <Link
              href="/stories"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-purple-deep transition-colors hover:text-purple"
            >
              View annual report
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-[16px] border border-line bg-white sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col border-b border-line p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r-0"
              >
                <span className="text-[32px] font-semibold tracking-tight text-purple-deep">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm text-body">{stat.label}</span>
                <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-mint px-2.5 py-1 pt-1 text-[10px] font-semibold text-moss">
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                  {stat.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-oak">
          <SectionHeading
            eyebrow="Our programmes"
            title="Where your support goes"
            description="Every donation, volunteer hour, and partnership directly funds one of our four core community programmes."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProgrammes.map((programme) => (
              <article
                key={programme.slug}
                className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-shadow hover:shadow-lift"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-mint">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p
                    className={cn(
                      "eyebrow",
                      accentText[programme.accent],
                    )}
                  >
                    {programme.shortTitle}
                  </p>
                  <h3 className="mt-2 text-[17px] font-semibold leading-snug text-ink">
                    {programme.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {programme.summary}
                  </p>
                  <Link
                    href={`/programmes/${programme.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-purple-deep transition-colors hover:text-purple"
                  >
                    Learn more
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                  <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-[11px] text-muted">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        accentDot[programme.accent],
                      )}
                    />
                    {programme.meta}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Human stories */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <SectionHeading
            eyebrow="Human stories"
            title="The people behind the numbers"
            description="Real stories from the women and communities we serve — the most honest measure of our impact."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
            <article className="flex flex-col overflow-hidden rounded-[18px] bg-ink text-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/stories/gabriel.jpg"
                  alt="Dr. Awauh Gabriel, a medical student supported by OAK"
                  fill
                  sizes="(min-width: 1024px) 640px, 90vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <Quote className="size-6 text-lime" aria-hidden="true" />
                <blockquote className="mt-4 text-[15px] leading-relaxed text-white/75">
                  When Gabriel&apos;s grandmother became a beneficiary of
                  Obroni Akunafo Kuo, she had one heartfelt wish: to see her
                  grandson achieve his dream of becoming a medical doctor.
                </blockquote>
                <div className="mt-auto flex items-center gap-3 pt-7">
                  <span className="flex size-10 items-center justify-center rounded-full bg-purple text-[12px] font-semibold text-white">
                    DA
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      Dr. Awauh Gabriel
                    </p>
                    <p className="text-[11px] text-white/50">
                      Beneficiary · Educational support · Ayomso, Ahafo
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-4">
              {testimonials.slice(0, 3).map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="flex flex-1 flex-col rounded-[16px] border border-line/80 bg-paper p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full text-[12px] font-semibold text-white",
                        testimonial.name === "Efta Owusu" && "bg-orange",
                        testimonial.name === "Sister Agnes" && "bg-moss",
                        testimonial.name === "Yaa Darko" && "bg-blue",
                      )}
                    >
                      {testimonial.initials}
                    </span>
                    <div>
                      <figcaption className="text-sm font-semibold text-ink">
                        {testimonial.name}
                      </figcaption>
                      <p className="text-[11px] text-muted">
                        {testimonial.role} · {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <blockquote className="mt-4 text-[13px] italic leading-relaxed text-body">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest stories */}
      {latestStories.length > 0 ? (
        <section className="bg-paper py-16 sm:py-20">
          <div className="container-oak">
            <SectionHeading
              eyebrow="From the field"
              title="Latest stories"
              description="Updates from the communities and programmes you support."
              action={
                <Link
                  href="/stories#lives-changed"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-grass hover:text-forest"
                >
                  All stories
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              }
            />

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {latestStories.map((story) => (
                <article
                  key={story.slug}
                  className="group flex flex-col overflow-hidden rounded-[16px] border border-line bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-mint">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-grass">
                      {story.category} · {formatDate(story.date)}
                    </p>
                    <h3 className="mt-2 text-[15px] font-semibold leading-snug text-ink">
                      {story.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[11.5px] leading-relaxed text-body">
                      {story.excerpt}
                    </p>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="mt-auto inline-flex items-center gap-1 pt-4 text-[11px] font-semibold text-grass hover:text-forest"
                    >
                      Read story
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Trust */}
      <section className="bg-[#F2F0F9] py-16 sm:py-20">
        <div className="container-oak">
          <SectionHeading
            eyebrow="Trust & transparency"
            title="Why donors trust Obroni Akunafo Kuo"
            description="We believe transparency is not optional — it is the foundation of every relationship we build with donors, volunteers, and partners."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="flex flex-col rounded-[14px] border border-white bg-white p-6 shadow-soft"
                >
                  <IconTile tone="purple">
                    <Icon className="size-5" aria-hidden="true" />
                  </IconTile>
                  <h3 className="mt-5 text-[15px] font-semibold text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {card.body}
                  </p>
                  <Link
                    href={card.href}
                    className="mt-auto inline-flex items-center gap-1 pt-5 text-[12px] font-semibold text-purple-deep transition-colors hover:text-purple"
                  >
                    {card.link}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-900 py-16 text-center text-white sm:py-24">
        <div className="container-oak">
          <Eyebrow tone="dark" className="justify-center text-violet">
            Take action today
          </Eyebrow>
          <h2 className="display-2 mx-auto mt-5 max-w-2xl text-white">
            Every contribution changes a life
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
            Whether you donate, volunteer, or partner with us — your involvement
            directly supports vulnerable people and communities.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/donate" size="lg">
              <Heart className="size-4" aria-hidden="true" />
              Donate now
            </ButtonLink>
            <ButtonLink href="/volunteer" variant="outline-dark" size="lg">
              <Users className="size-4" aria-hidden="true" />
              Become a volunteer
            </ButtonLink>
            <ButtonLink href="/partner" variant="outline-dark" size="lg">
              <Landmark className="size-4" aria-hidden="true" />
              Partner with us
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Founder note (SEO / trust) */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Eyebrow>From our founder</Eyebrow>
            <h2 className="display-3 mt-4">
              &ldquo;No one should face hardship alone.&rdquo;
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {leadership.founder.name}, {leadership.founder.role}
            </p>
          </div>
          <div className="rounded-[16px] border border-line bg-paper p-7 sm:p-9">
            <blockquote className="text-lg leading-relaxed text-body">
              &ldquo;{leadership.founder.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-xs text-muted">
              <span>Founded {org.founded}</span>
              <span>Reg. {org.regNo}</span>
              <span>TIN {org.tin}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
