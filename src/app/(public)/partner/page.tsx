import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  Anchor,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  Coffee,
  Download,
  FileBarChart,
  FileText,
  HeartPulse,
  Home,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PartnerForm } from "@/components/forms/partner-form";
import { LogoMark } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { partnerDocuments } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner with us",
  description:
    "Partner with Obroni Akunafo Kuo to create lasting impact in Ghana's Ahafo Region. Explore corporate, in-kind, skills and strategic partnerships.",
  alternates: { canonical: "/partner" },
};

const whyPartner = [
  {
    no: "01",
    title: "Community Outreach",
    body: "Supporting approximately 800–1,000 beneficiaries, with presence across the Ahafo Region and beyond.",
  },
  {
    no: "02",
    title: "Inclusive impact",
    body: "Work spans widows, orphans, persons with disabilities and the aged — covering the most overlooked groups.",
  },
  {
    no: "03",
    title: "Established presence",
    body: "Founded in 2016 with a decade of consistent, community-focused work and an annual audit process.",
  },
  {
    no: "04",
    title: "Community collaboration",
    body: "Works alongside community leaders, churches and volunteers — embedded in local structures, not external to them.",
  },
] as const;

const impact = [
  { value: "2016", label: "Year founded", note: "A decade of community service" },
  {
    value: "800–1,000",
    label: "Beneficiaries supported",
    note: "As reported by the organisation",
  },
  {
    value: "200+",
    label: "Persons With Disabilities",
    note: "Across the Ahafo Region",
  },
  {
    value: "Annual",
    label: "Independent audit",
    note: "Financial accountability confirmed",
  },
] as const;

const areas = [
  {
    icon: BookOpen,
    title: "Education support",
    body: "Supporting vulnerable children with learning access and materials.",
    tone: "mint",
  },
  {
    icon: HeartPulse,
    title: "Healthcare initiatives",
    body: "Health access and support for beneficiaries in the community.",
    tone: "mint",
  },
  {
    icon: Coffee,
    title: "Food & essential relief",
    body: "Direct relief provision for widows, orphans and the aged.",
    tone: "amber",
  },
  {
    icon: Anchor,
    title: "Widow empowerment",
    body: "Livelihood and skills initiatives for widows in vulnerable households.",
    tone: "amber",
  },
  {
    icon: Accessibility,
    title: "Disability inclusion",
    body: "Programmes supporting 200+ persons with disabilities.",
    tone: "mint",
  },
  {
    icon: Users,
    title: "Support for the aged",
    body: "Care, companionship and assistance for elderly community members.",
    tone: "mint",
  },
  {
    icon: Home,
    title: "Community outreach",
    body: "On-the-ground activities reaching households across multiple communities.",
    tone: "amber",
  },
  {
    icon: Sparkles,
    title: "Skills development",
    body: "Practical and vocational skills training through community initiatives.",
    tone: "amber",
  },
] as const;

const governance = [
  {
    label: "Board of Trustees",
    title: "Policy-making body",
    body: "Consists of 5–7 members responsible for setting organisational policy and ensuring alignment with the mission and constitution.",
  },
  {
    label: "Executive Council",
    title: "Operational leadership",
    body: "The Executive Council provides day-to-day organisational leadership through the following confirmed roles:",
    list: [
      "Chairperson",
      "Vice Chairperson",
      "Secretary",
      "Treasurer",
      "Organizer",
      "Programmes Coordinator",
    ],
  },
  {
    label: "General Assembly",
    title: "Membership body",
    body: "The General Assembly comprises all registered members of the organisation and plays a role in key organisational decisions as defined by the constitution.",
  },
  {
    label: "Financial Accountability",
    title: "Audit & financial controls",
    body: "The constitution confirms that the organisation maintains a designated bank account requiring two authorised signatories for all transactions.",
    callout: "Independent financial audit conducted annually",
  },
] as const;

const nextSteps = [
  "Submit your partnership enquiry using the form",
  "The team reviews your information and interest area",
  "A team member contacts you to discuss next steps",
  "Partnership opportunities are explored together",
] as const;

const trustSignals = [
  "Founded and operating since 2016",
  "Annual independent financial audit",
  "Board of Trustees governance structure",
  "Non-partisan and non-discriminatory",
  "Two-signatory bank account controls",
] as const;

export default function PartnerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-oak grid gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-grass/30 bg-grass/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-grass">
              <Building2 className="size-3" aria-hidden="true" />
              Corporate &amp; community partnerships
            </span>

            <h1 className="display-1 mt-6 max-w-xl">
              Partner with us to create{" "}
              <span className="text-grass">lasting impact</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-base">
              Obroni Akunafo Kuo welcomes organisations interested in supporting
              vulnerable communities through partnerships, resources, expertise
              or community initiatives. We work with communities across the
              Ahafo Region and beyond.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#enquiry" size="lg">
                <CalendarDays className="size-4" aria-hidden="true" />
                Request a partnership meeting
              </ButtonLink>
              <a
                href="/documents/organisation-profile.pdf"
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-white/20 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
              >
                <Download className="size-4" aria-hidden="true" />
                Download info pack
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[10.5px] text-white/40">
              {[
                "Founded 2016",
                "800–1,000 beneficiaries",
                "Annual audit",
                "Board & Executive governance",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-grass" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <LogoMark className="size-9" />
              <div>
                <p className="text-[13px] font-semibold">Obroni Akunafo Kuo</p>
                <p className="text-[8.5px] text-white/40">
                  Obaa Kunani — Awurade Ne Me Boafo
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                ["2016", "Year founded"],
                ["800+", "Beneficiaries supported"],
                ["200+", "PWDs supported"],
                ["10yr", "Community presence"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[8px] border border-white/[0.06] bg-white/[0.04] p-4"
                >
                  <p className="text-2xl font-semibold text-grass">{value}</p>
                  <p className="mt-1 text-[10px] text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Why partner with us?</Eyebrow>
          <h2 className="display-2 mt-4 max-w-3xl">
            Four reasons organisations choose to collaborate
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Grounded in what Obroni Akunafo Kuo has confirmed about its work and
            the communities it serves.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyPartner.map((item) => (
              <div
                key={item.no}
                className="rounded-[10px] bg-paper p-6"
              >
                <p className="text-[11px] text-muted">{item.no}</p>
                <h3 className="mt-5 text-lg font-medium leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact at a glance */}
      <section className="bg-paper py-12">
        <div className="container-oak">
          <Eyebrow>Impact at a glance</Eyebrow>
          <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-[10px] border border-line bg-white lg:grid-cols-4">
            {impact.map((item) => (
              <div
                key={item.label}
                className="border-b border-r border-line px-5 py-8 text-center last:border-r-0 lg:border-b-0"
              >
                <p className="text-2xl font-semibold text-grass">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] text-ink">{item.label}</p>
                <p className="mt-1 text-[9.5px] italic text-muted">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of partnership */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Areas of partnership</Eyebrow>
          <h2 className="display-2 mt-4">Where collaboration can create impact</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            These are areas where Obroni Akunafo Kuo operates. If you have a
            specific partnership interest not listed here, mention it in your
            enquiry.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="rounded-[10px] border border-line bg-white p-5"
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-[6px] ${
                      area.tone === "mint"
                        ? "bg-mint text-moss"
                        : "bg-amber/10 text-amber"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[13px] font-medium text-ink">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                    {area.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="bg-mint py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Governance &amp; accountability</Eyebrow>
          <h2 className="display-2 mt-4">
            How Obroni Akunafo Kuo is structured
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Based on the organisation&apos;s confirmed constitution. Leadership
            names, qualifications and registration documents will be added when
            confirmed by the organisation.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {governance.map((item) => (
              <div
                key={item.label}
                className="flex flex-col rounded-[10px] border border-line bg-white p-6"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </p>
                <h3 className="mt-2 text-[15px] font-medium text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  {item.body}
                </p>
                {"list" in item && item.list ? (
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {item.list.map((role) => (
                      <li
                        key={role}
                        className="flex items-center gap-2 text-[10.5px] text-body"
                      >
                        <span className="size-1 rounded-full bg-grass" />
                        {role}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {"callout" in item && item.callout ? (
                  <div className="mt-4 flex items-center gap-2.5 rounded-[6px] bg-mint px-4 py-3 text-[11px] text-moss">
                    <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                    {item.callout}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Mission &amp; vision</Eyebrow>
          <h2 className="display-2 mt-4">The purpose behind our work</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Confirmed statements from Obroni Akunafo Kuo&apos;s founding
            documents.
          </p>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <div className="rounded-[10px] border-2 border-forest p-7">
              <span className="inline-flex rounded-[4px] bg-mint px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-moss">
                Mission
              </span>
              <p className="mt-6 text-[15px] italic leading-relaxed text-body">
                &ldquo;To restore dignity, hope and sustainable livelihoods to
                widows, orphans and the aged in Ghana through compassionate
                care, education, healthcare support and empowerment.&rdquo;
              </p>
            </div>
            <div className="rounded-[10px] border-2 border-orange p-7">
              <span className="inline-flex rounded-[4px] bg-amber/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber">
                Vision
              </span>
              <p className="mt-6 text-[15px] italic leading-relaxed text-body">
                &ldquo;A Ghana where every widow is empowered, every orphan is
                educated and loved, and every aged person lives in dignity,
                security and respect.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Partnership information</Eyebrow>
          <h2 className="display-2 mt-4">Organisational documents</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            Documents available to prospective partners for due diligence.
            Additional reports and materials will be added as they are confirmed
            and prepared by the organisation.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {partnerDocuments.map((doc, index) => {
              const Icon = index === 0 ? FileText : index === 1 ? ScrollText : FileBarChart;
              return (
                <div
                  key={doc.title}
                  className="flex flex-col rounded-[10px] border border-line bg-white p-6"
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-[6px] ${
                      index === 2
                        ? "bg-amber/10 text-amber"
                        : "bg-mint text-moss"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[13.5px] font-medium text-ink">
                    {doc.title}
                  </h3>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                    {doc.body}
                  </p>
                  {index === 2 ? (
                    <p className="mt-auto pt-4 text-[10.5px] font-medium text-orange">
                      Awaiting NGO confirmation
                    </p>
                  ) : (
                    <a
                      href={doc.href}
                      className="mt-auto inline-flex items-center gap-1 pt-4 text-[10.5px] font-semibold text-grass hover:text-forest"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="scroll-mt-24 bg-paper">
        <div className="container-oak grid lg:grid-cols-[1fr_360px]">
          <div className="py-12 sm:py-16 lg:pr-14">
            <Eyebrow>Partnership enquiry</Eyebrow>
            <h2 className="display-2 mt-4">Tell us about your organisation</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
              Tell us a little about your organisation and what you would like
              to explore. Our team will review your enquiry and contact you
              about the next steps.
            </p>
            <div className="mt-8">
              <PartnerForm />
            </div>
          </div>

          <aside className="border-t border-line bg-white py-12 lg:border-l lg:border-t-0 lg:pl-9">
            <div className="rounded-[10px] border border-line bg-white p-5">
              <p className="text-[12px] font-semibold text-ink">
                What happens next?
              </p>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-grass text-[9px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-[10.5px] leading-relaxed text-muted">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-line pt-3 text-[9.5px] leading-relaxed text-muted">
                Submitting this form does not guarantee a partnership placement
                or agreement.
              </p>
            </div>

            <div className="mt-4 rounded-[10px] border border-line bg-white p-5">
              <p className="text-[12px] font-semibold text-ink">
                Organisation at a glance
              </p>
              <div className="mt-3 flex items-center gap-2.5 border-b border-line pb-3">
                <LogoMark className="size-9" />
                <div>
                  <p className="text-[11px] font-semibold text-ink">
                    Obroni Akunafo Kuo
                  </p>
                  <p className="text-[8.5px] text-muted">
                    Non-profit NGO · Est. 2016
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["800+", "Beneficiaries"],
                  ["200+", "PWDs supported"],
                  ["Annual", "Audit"],
                  ["10yr", "In community"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[6px] bg-paper p-3">
                    <p className="text-[15px] font-semibold text-grass">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[9px] text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[10px] bg-mint p-5">
              <p className="text-[12px] font-semibold text-ink">
                Trust signals
              </p>
              <ul className="mt-3 space-y-2.5">
                {trustSignals.map((signal) => (
                  <li
                    key={signal}
                    className="flex items-start gap-2 text-[10.5px] leading-relaxed text-body"
                  >
                    <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-[3px] bg-grass text-white">
                      <Check className="size-2.5" aria-hidden="true" />
                    </span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-[10px] leading-relaxed text-muted">
              Prefer to talk first?{" "}
              <Link href="/contact" className="font-semibold text-grass">
                Contact our team
              </Link>{" "}
              or call 0241 936 699.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
