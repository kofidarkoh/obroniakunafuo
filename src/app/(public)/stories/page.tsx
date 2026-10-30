import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Bus,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Gift,
  GraduationCap,
  HandHeart,
  Heart,
  HeartHandshake,
  Hospital,
  Landmark,
  PieChart,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge, Eyebrow } from "@/components/ui/primitives";
import {
  accomplishments,
  annualReport,
  expenditure,
  expenditureRows,
  incomeReceived,
  org,
  storiesTestimonials,
} from "@/lib/site";
import { listStories } from "@/lib/data/content";
import { cn, formatDate, formatGhc } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stories & impact",
  description:
    "Real people, real impact. Read the stories behind Obroni Akunafo Kuo's work and see exactly how every cedi was spent in the Ahafo Region.",
};

const categoryIcons = {
  Education: GraduationCap,
  "Health & Hospital": Hospital,
  "Social Welfare": HeartHandshake,
  "Community Support": Users,
  "Admin / Transport": Bus,
} as const;

const accomplishmentIcons = {
  graduation: GraduationCap,
  accessibility: Accessibility,
  hospital: Hospital,
  gift: Gift,
  eye: Eye,
  "pie-chart": PieChart,
} as const;

const dotColors: Record<string, string> = {
  Education: "#2E8B2E",
  Health: "#2D6FE8",
  Social: "#C2410C",
  Community: "#9A69EB",
  Admin: "#6B7280",
};

const tabs = [
  { label: "All Stories", href: "#stories", active: true },
  { label: "Success Stories", href: "#lives-changed", active: false },
  { label: "Testimonials", href: "#testimonials", active: false },
  { label: "Impact Data", href: "#impact", active: false },
  { label: "Annual report", href: "#annual", active: false },
] as const;

function storyTone(category: string): "mint" | "blue" | "amber" | "purple" {
  if (category === "Education") return "blue";
  if (category === "Health") return "amber";
  if (category === "Community") return "mint";
  return "purple";
}

export default async function StoriesPage() {
  const stories = await listStories();

  return (
    <>
      {/* Hero */}
      <section id="stories" className="scroll-mt-24 bg-ink text-white">
        <div className="container-oak grid gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-grass/30 bg-grass/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-grass">
              <span className="size-1.5 rounded-full bg-lime" />
              Real people · Real impact · Ahafo Region
            </span>

            <h1 className="display-1 mt-6 max-w-xl">
              The people behind the{" "}
              <span className="text-grass">numbers</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-base">
              Every statistic represents a real person whose life has changed.
              These are the stories of widows, orphans, persons with
              disabilities and the aged whose dignity has been restored through
              your support.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-1 gap-x-8 gap-y-3 text-[12.5px] text-white/60 sm:grid-cols-2">
              {[
                `${formatGhc(492745.68, 2)} total expenditure`,
                "50+ students supported",
                "800–1,000 beneficiaries",
                "Audited annually",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-grass" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Annual report card */}
          <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-6 sm:p-7">
            <div className="flex items-start gap-3 border-b border-white/10 pb-5">
              <span className="flex size-9 items-center justify-center rounded-[9px] bg-grass/15 text-grass">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[12px] font-semibold text-grass">
                  Annual Report &amp; Statement of Account
                </p>
                <p className="mt-0.5 text-[10.5px] text-white/40">
                  Period: September 2024 – January 2026
                </p>
              </div>
            </div>

            <p className="mt-5 text-4xl font-semibold tracking-tight">
              {formatGhc(annualReport.total, 2)}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              Total expenditure — confirmed by OAK Secretary
            </p>

            <div className="mt-6 space-y-3.5">
              {expenditure.map((item) => {
                const Icon =
                  categoryIcons[item.category as keyof typeof categoryIcons];
                return (
                  <div key={item.category}>
                    <div className="flex items-center justify-between gap-4 text-[11px]">
                      <span className="flex items-center gap-2 text-white/65">
                        <Icon className="size-3.5" aria-hidden="true" />
                        {item.category}
                      </span>
                      <span className="shrink-0 text-white/55">
                        <span className="font-semibold text-white/80">
                          {item.share}%
                        </span>{" "}
                        · {formatGhc(item.amount, 2)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.share}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 border-t border-white/10 pt-4 text-[10px] text-white/35">
              Prepared by {annualReport.preparedBy} ·{" "}
              {annualReport.preparedOn}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav
        aria-label="Stories sections"
        className="border-b border-line bg-white"
      >
        <div className="container-oak flex overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "shrink-0 border-b-2 px-5 py-4 text-[13px] transition-colors first:pl-0 sm:px-8",
                tab.active
                  ? "border-ink font-semibold text-ink"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Stats */}
      <section className="bg-white">
        <div className="container-oak">
          <div className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line lg:grid-cols-4 lg:divide-y-0">
            {[
              {
                value: "GHC 492,745",
                label: "Total expenditure",
                sub: "Sept 2024–Jan 2026",
                badge: "Annual report confirmed",
              },
              {
                value: "50+",
                label: "Students supported",
                sub: "Across all education levels",
                badge: "Annual report confirmed",
              },
              {
                value: "72.5%",
                label: "Of spending on education",
                sub: "Core mandate",
                badge: "Annual report confirmed",
              },
              {
                value: "800+",
                label: "Beneficiaries supported",
                sub: "Across Ahafo Region",
                badge: "Organisation confirmed",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-4 py-8 text-center"
              >
                <p className="text-2xl font-semibold tracking-tight text-grass sm:text-[28px]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[11.5px] font-medium text-ink">
                  {stat.label}
                </p>
                <p className="mt-1 text-[10px] text-muted">{stat.sub}</p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-mint px-2 py-1 text-[8.5px] font-medium text-moss">
                  <CheckCircle2 className="size-2.5" aria-hidden="true" />
                  {stat.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual report band */}
      <section id="annual" className="scroll-mt-24 bg-forest text-white">
        <div className="container-oak flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-grass">
              Annual report &amp; statement of account
            </p>
            <p className="mt-1.5 text-[12px] text-white/75">
              Period: September 2024 to January 2026
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] text-white/45">Prepared by</p>
            <p className="mt-1 text-[12px] text-white/80">
              {annualReport.preparedBy} · {annualReport.preparedOn}
            </p>
          </div>
        </div>
      </section>

      {/* Impact data */}
      <section id="impact" className="scroll-mt-24 bg-paper py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Impact data</Eyebrow>
          <h2 className="display-2 mt-4">How every cedi was spent</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            A full breakdown of the {formatGhc(annualReport.total, 2)} spent
            between September 2024 and January 2026 — confirmed by the OAK
            Secretary in the official annual report.
          </p>

          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            {/* Category card */}
            <div className="rounded-[14px] border border-line bg-white p-6 sm:p-7">
              <h3 className="text-[15px] font-semibold text-ink">
                Expenditure by category
              </h3>
              <p className="mt-1 text-[11px] text-muted">
                Sept 2024 – Jan 2026 · All figures in GHC
              </p>

              <div className="mt-6 flex items-center justify-between gap-4 border-b border-line pb-5">
                <span className="text-[13px] font-medium text-ink">
                  Total expenditure
                </span>
                <span className="text-2xl font-semibold tracking-tight text-grass">
                  {formatGhc(annualReport.total, 2)}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {expenditure.map((item) => {
                  const Icon =
                    categoryIcons[item.category as keyof typeof categoryIcons];
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between gap-4 text-[11.5px]">
                        <span className="flex items-center gap-2 text-body">
                          <Icon
                            className="size-3.5"
                            style={{ color: item.color }}
                            aria-hidden="true"
                          />
                          {item.category}
                        </span>
                        <span className="shrink-0 text-muted">
                          <span className="font-semibold text-ink">
                            {formatGhc(item.amount, 2)}
                          </span>{" "}
                          <span
                            className="ml-1 rounded px-1.5 py-0.5 text-[9px] font-semibold"
                            style={{
                              color: item.color,
                              backgroundColor: `${item.color}14`,
                            }}
                          >
                            {item.share}%
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.share}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7">
                <p className="eyebrow text-muted">Income received</p>
                <div className="mt-3 rounded-[10px] bg-paper p-4">
                  <div className="flex items-center justify-between gap-4 text-[12px]">
                    <span className="font-medium text-ink">
                      {incomeReceived.label}
                    </span>
                    <span className="font-semibold text-ink">
                      {formatGhc(incomeReceived.amount, 2)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-muted">
                    {incomeReceived.note}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed table */}
            <div className="overflow-hidden rounded-[14px] border border-line bg-white">
              <div className="bg-ink px-6 py-5 text-white">
                <h3 className="text-[14px] font-semibold">
                  Detailed expenditure
                </h3>
                <p className="mt-1 text-[10.5px] text-white/45">
                  All transactions · Sept 2024 – Jan 2026
                </p>
              </div>

              <div className="max-h-[640px] overflow-y-auto">
                <table className="w-full text-left text-[11.5px]">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="border-b border-line text-[9px] uppercase tracking-[0.12em] text-muted">
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-2 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 text-right font-medium">
                        Amount (GHC)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenditureRows.map((row) => (
                      <tr
                        key={`${row.date}-${row.item}`}
                        className="border-b border-line/70"
                      >
                        <td className="whitespace-nowrap px-5 py-3 text-[10.5px] text-muted">
                          {row.date}
                        </td>
                        <td className="px-2 py-3 text-ink">
                          <span className="flex items-center gap-2">
                            <span
                              className="size-1.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  dotColors[row.category] ?? "#6B7280",
                              }}
                            />
                            {row.item}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right font-medium tabular-nums text-ink">
                          {row.amount.toLocaleString("en-GH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4 text-white">
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Overall expenditure
                </span>
                <span className="text-[15px] font-semibold text-grass">
                  {formatGhc(annualReport.total, 2).replace("GHC ", "")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accomplishments */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Key achievements</Eyebrow>
          <h2 className="display-2 mt-4">
            What we accomplished · Sept 2024–Jan 2026
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Six confirmed achievements from the official annual report — each
            representing real people whose lives were changed.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accomplishments.map((item) => {
              const Icon =
                accomplishmentIcons[
                  item.icon as keyof typeof accomplishmentIcons
                ];
              return (
                <div
                  key={item.title}
                  className="flex flex-col rounded-[14px] border border-line bg-white p-6"
                >
                  <span className="flex size-9 items-center justify-center rounded-[9px] bg-mint text-moss">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-grass">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-ink">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                  <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-mint px-2 py-1 pt-1 text-[8.5px] font-medium text-moss">
                    <CheckCircle2 className="size-2.5" aria-hidden="true" />
                    Annual report confirmed
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lives changed */}
      <section
        id="lives-changed"
        className="scroll-mt-24 bg-paper py-16 sm:py-20"
      >
        <div className="container-oak">
          <Eyebrow>Success stories</Eyebrow>
          <h2 className="display-2 mt-4">Lives that have been changed</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Real stories from the widows, children and communities your support
            reaches across the Ahafo Region.
          </p>

          {stories.length === 0 ? (
            <p className="mt-9 rounded-[14px] border border-dashed border-line bg-white px-6 py-12 text-center text-sm text-muted">
              New stories will appear here once they are published.
            </p>
          ) : (
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {stories.map((story) => (
                <article
                  key={story.slug}
                  className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-mint">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-ink">
                      {story.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <Badge tone={storyTone(story.category)}>
                      {story.programmes[0] ?? story.category}
                    </Badge>
                    <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-ink">
                      {story.title}
                    </h3>
                    <p className="mt-1 text-[10.5px] text-muted">
                      {formatDate(story.date)} · {story.location}
                    </p>
                    <p className="mt-3 line-clamp-3 text-[11.5px] leading-relaxed text-body">
                      {story.excerpt}
                    </p>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="mt-auto inline-flex items-center gap-1 pt-4 text-[11px] font-semibold text-grass hover:text-forest"
                    >
                      Read full story
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Secretary quote */}
      <section className="bg-forest-deep text-white">
        <div className="container-oak py-14 text-center sm:py-16">
          <p className="eyebrow text-grass">From the OAK annual report</p>
          <Quote
            className="mx-auto mt-8 size-6 text-white/25"
            aria-hidden="true"
          />
          <blockquote className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-[22px]">
            {annualReport.secretaryQuote}
          </blockquote>
          <p className="mt-8 text-[12px] font-semibold text-white">
            {annualReport.preparedBy}
          </p>
          <p className="mt-1 text-[10.5px] text-white/40">
            {annualReport.preparedOn}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="scroll-mt-24 bg-white py-16 sm:py-20"
      >
        <div className="container-oak">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="display-2 mt-4">What our community says</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Voices from beneficiaries, volunteers and community partners —
            placeholder quotes ready to be replaced with real testimonials.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {storiesTestimonials.map((item) => (
              <figure
                key={item.name}
                className="rounded-[14px] border border-line bg-white p-6"
              >
                <div className="flex gap-0.5 text-gold" aria-label="5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3 fill-current"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 text-[12.5px] italic leading-relaxed text-body">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.initials}
                  </span>
                  <span>
                    <span className="block text-[12px] font-semibold text-ink">
                      {item.name}
                    </span>
                    <span className="block text-[10px] text-muted">
                      {item.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-8 rounded-[14px] border border-grass/20 bg-mint px-6 py-8 text-center">
            <h3 className="text-lg font-semibold text-ink">
              Has Obroni Akunafo Kuo made a difference in your life?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed text-muted">
              We would love to share your story. Contact us to tell us about
              your experience — with your permission, your story could inspire
              others to support our mission.
            </p>
            <ButtonLink href="/contact" className="mt-5">
              <HandHeart className="size-4" aria-hidden="true" />
              Share your story
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white">
        <div className="container-oak py-16 text-center sm:py-20">
          <p className="eyebrow text-grass">Be part of the story</p>
          <h2 className="display-2 mx-auto mt-5 max-w-2xl">
            Every contribution creates a story worth telling
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55">
            Donate, volunteer or partner with us — and help write the next
            chapter in the lives of our beneficiaries.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/donate"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-lime px-6 text-[14px] font-semibold text-forest transition-colors hover:bg-grass hover:text-white"
            >
              <Heart className="size-4" aria-hidden="true" />
              Donate now
            </Link>
            <ButtonLink href="/volunteer" variant="outline-dark" size="lg">
              <Users className="size-4" aria-hidden="true" />
              Become a volunteer
            </ButtonLink>
            <ButtonLink href="/partner" variant="outline-dark" size="lg">
              <Landmark className="size-4" aria-hidden="true" />
              Partner with us
            </ButtonLink>
          </div>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-white/35">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3" aria-hidden="true" />
              Registered NGO · {org.regNo}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3" aria-hidden="true" />
              Audited annually
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              72.5% programme rate
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
