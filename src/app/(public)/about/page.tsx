import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Landmark,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { getSiteSettings } from "@/lib/data/content";
import {
  governance,
  leadership,
  org,
  timeline,
  values,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Founded in 2016 by Mr. Bernard Adu Tutu, Obroni Akunafo Kuo is a registered Ghanaian NGO restoring dignity and hope to widows, orphans, persons with disabilities and the aged in the Ahafo Region.",
  alternates: { canonical: "/about" },
};

const aboutStats = [
  {
    value: "GHC 492,745",
    label: "Total expenditure Sept 2024–Jan 2026",
  },
  { value: "50+", label: "Students supported across all levels" },
  { value: "72.5%", label: "Programme rate — direct programme spending" },
  { value: "800+", label: "Beneficiaries across Ahafo Region" },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-white">
        <div className="container-oak py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                <span className="size-1.5 rounded-full bg-lime" />
                Founded {org.founded} · Mim, Ahafo Region
              </span>

              <h1 className="display-1 mt-6 max-w-[13ch]">
                We are each other&apos;s{" "}
                <span className="text-lime">keeper</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
                Obroni Akunafo Kuo has spent a decade restoring dignity, hope
                and community to widows, orphans, persons with disabilities and
                the aged across Ghana&apos;s Ahafo Region and beyond.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {["Widows", "Orphans", "Persons with Disabilities", "The Aged"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs text-white/70"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/55">
                {[
                  `Est. ${org.founded}`,
                  "800–1,000 beneficiaries",
                  "200+ PWDs",
                  `Reg. No. ${org.regNo}`,
                  "Annual audit",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-lime" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[440px] rounded-[20px] bg-white p-6 text-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8 lg:justify-self-end">
              <div className="flex justify-center">
                <Image
                  src="/images/oak-logo.png"
                  alt="Obroni Akunafo Kuo emblem"
                  width={320}
                  height={320}
                  className="size-36 object-contain sm:size-44"
                />
              </div>
              <p className="mt-6 text-center text-xs text-muted">
                Motto:{" "}
                <span className="font-medium text-ink">{org.motto}</span>
              </p>
              <p className="mt-1 text-center text-[11px] text-muted">
                Restoring Hope, Dignity and Love
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 border-t border-line pt-4 text-[10px] text-muted">
                <span>Reg. No. {org.regNo}</span>
                <span className="size-1 rounded-full bg-line" />
                <span>TIN: {org.tin}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow tone="green">Our purpose</Eyebrow>
          <h2 className="display-2 mt-4">Why we exist</h2>

          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            <article className="flex flex-col rounded-[16px] bg-forest p-8 text-white sm:p-10">
              <Eyebrow tone="dark">Mission</Eyebrow>
              <h3 className="display-3 mt-4">Our mission</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
                To restore hope and sustainable livelihoods to widows, orphans
                and the aged in Ghana through compassionate care, education,
                healthcare, support, empowerment and community inclusion.
              </p>
            </article>
            <article className="flex flex-col rounded-[16px] bg-paper p-8 sm:p-10">
              <Eyebrow tone="green">Vision</Eyebrow>
              <h3 className="display-3 mt-4">Our vision</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-body">
                A Ghana where every widow is empowered, every orphan is
                educated and loved, and every aged person lives in dignity,
                security and respect.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-oak grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Eyebrow tone="green">Our story</Eyebrow>
            <h2 className="display-2 mt-4 max-w-[16ch]">
              From compassion to a movement of hope
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-body">
              <p>
                Founded in 2016 by Mr. Bernard Adu Tutu in Mim, Ahafo Region,
                what began as a personal commitment to support widows and
                orphans grew into a registered NGO serving hundreds of the most
                vulnerable.
              </p>
              <p>
                In 2019 we were formally registered. By 2023 we expanded to
                include Persons With Disabilities — now 200+ beneficiaries. In
                2026 we mark our 10th anniversary.
              </p>
              <p>
                Today our work spans food relief, education sponsorship,
                healthcare support, shelter and widow empowerment — delivered
                with the belief that community is the strongest safety net
                there is.
              </p>
            </div>
            <Link
              href="/stories"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-deep hover:text-purple"
            >
              Read our stories
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="relative flex flex-col gap-7 border-l border-forest/15 pl-6">
            {timeline.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[30px] top-1.5 size-2 rounded-full bg-grass ring-4 ring-paper" />
                <p className="text-[13px] font-semibold text-moss">
                  {item.year}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow tone="green">Our values</Eyebrow>
          <h2 className="display-2 mt-4">What guides everything we do</h2>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.no}
                className="rounded-[14px] bg-mint p-6"
              >
                <span className="text-3xl font-semibold text-grass/35">
                  {value.no}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section id="governance" className="scroll-mt-24 bg-paper py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow tone="green">Governance</Eyebrow>
          <h2 className="display-2 mt-4">How we are governed</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-body">
            Our constitution establishes a Board of Trustees, Executive Council
            and General Assembly — with a two-signatory bank account and annual
            independent audit.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {governance.map((item) => (
              <article
                key={item.no}
                className="rounded-[14px] border border-line bg-white p-6"
              >
                <span className="text-2xl font-semibold text-grass/40">
                  {item.no}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Leadership</Eyebrow>
          <h2 className="display-2 mt-4">Meet our founder</h2>

          <div className="mt-9 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <div className="flex flex-col gap-4">
              <article className="overflow-hidden rounded-[16px] border border-line bg-white shadow-soft">
                <div className="relative aspect-[4/5] bg-paper">
                  <Image
                    src="/images/people/founder.jpg"
                    alt="Mr. Bernard Adu Tutu, Founder and Chairman of Obroni Akunafo Kuo"
                    fill
                    sizes="(min-width: 1024px) 360px, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink">
                    {leadership.founder.name}
                  </h3>
                  <p className="text-xs text-muted">
                    {leadership.founder.role}
                  </p>
                  <div className="mt-4 space-y-2 border-t border-line pt-4 text-[11px] text-muted">
                    <a
                      href={`mailto:${leadership.founder.email}`}
                      className="flex items-center gap-2 hover:text-ink"
                    >
                      <Mail className="size-3.5 text-grass" />
                      {leadership.founder.email}
                    </a>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-grass" />
                      {settings.address}
                    </p>
                  </div>
                </div>
              </article>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[12px] bg-paper p-4">
                  <p className="eyebrow text-muted">Business Reg. No.</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {org.regNo}
                  </p>
                </div>
                <div className="rounded-[12px] bg-paper p-4">
                  <p className="eyebrow text-muted">TIN</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {org.tin}
                  </p>
                </div>
              </div>

              <article className="rounded-[16px] border border-line bg-white p-5">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/people/collins.jpg"
                    alt="Collins Afriyie"
                    width={96}
                    height={96}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {leadership.secretary.name}
                    </p>
                    <p className="text-[11px] text-muted">
                      {leadership.secretary.role} · Obroni Akunafo Kuo
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-muted">
                  Presented the official Annual Report (Sept 2024 – Jan 2026),
                  confirming GHC 492,745.68 in expenditure.
                </p>
              </article>
            </div>

            <div>
              <p className="text-[15px] leading-relaxed text-body">
                Obroni Akunafo Kuo was founded by{" "}
                <strong className="font-semibold text-ink">
                  Mr. Bernard Adu Tutu
                </strong>
                , who saw firsthand the suffering of widows, orphans and the
                aged in the Mim community and felt compelled to act. What
                started as a personal compassion became a movement — and today,
                that movement serves over 800 to 1,000 people across the Ahafo
                Region.
              </p>

              <blockquote className="mt-7 rounded-[12px] border-l-4 border-grass bg-mint px-6 py-5 text-sm italic leading-relaxed text-forest">
                &ldquo;True community means we are each other&apos;s keeper. No
                one should suffer alone because they have lost a spouse,
                parent, or strength.&rdquo;
                <footer className="mt-3 text-xs not-italic text-moss">
                  — Mr. Bernard Adu Tutu, Founder
                </footer>
              </blockquote>

              <p className="mt-7 text-[15px] leading-relaxed text-body">
                Under his leadership, the organisation has grown from a small
                outreach into a registered, audited non-governmental
                organisation — with a board, an executive council, and a growing
                community of volunteers and partners who share the same mission.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/donate">
                  <Heart className="size-4" aria-hidden="true" />
                  Donate now
                </ButtonLink>
                <ButtonLink href="/volunteer" variant="outline">
                  <Users className="size-4" aria-hidden="true" />
                  Become a volunteer
                </ButtonLink>
                <ButtonLink href="/partner" variant="ghost">
                  <Landmark className="size-4" aria-hidden="true" />
                  Partner with us
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + CTA */}
      <section className="bg-forest text-white">
        <div className="container-oak py-16 sm:py-20">
          <div className="grid gap-8 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
            {aboutStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold tracking-tight text-grass">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/55">
                  {stat.label}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-grass/30 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide text-grass">
                  Annual report confirmed
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl pt-14 text-center">
            <Eyebrow tone="dark" className="justify-center text-grass">
              Support our work
            </Eyebrow>
            <h2 className="display-2 mt-4">
              Join us in restoring hope and dignity
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Every donation, every volunteer hour and every partnership
              directly changes lives in Ghana&apos;s Ahafo Region.
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
        </div>
      </section>
    </>
  );
}
