import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Clock,
  HandHeart,
  Heart,
  HeartHandshake,
  Landmark,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { BulletList, Eyebrow } from "@/components/ui/primitives";
import { getSiteSettings } from "@/lib/data/content";
import { faqs, org } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Get involved",
  description:
    "Donate, volunteer, partner with us or join the team at Obroni Akunafo Kuo. There is a place for everyone here.",
};

const heroCards = [
  {
    href: "/donate",
    icon: Heart,
    title: "Donate",
    body: "Give once or monthly to fund our programmes.",
    className:
      "border-[#1E4A1E] bg-[#12300F] hover:bg-[#163B13] text-lime",
    iconClass: "bg-lime/10 text-lime",
  },
  {
    href: "/volunteer",
    icon: HandHeart,
    title: "Volunteer",
    body: "Contribute your time, skills and compassion.",
    className:
      "border-[#3A2466] bg-[#241442] hover:bg-[#2C1950] text-violet",
    iconClass: "bg-violet/15 text-violet",
  },
  {
    href: "/partner",
    icon: Landmark,
    title: "Partner",
    body: "Explore corporate and corporate giving.",
    className:
      "border-[#4A2E12] bg-[#32200D] hover:bg-[#3C2711] text-gold",
    iconClass: "bg-gold/15 text-gold",
  },
] as const;

const ways = [
  {
    no: "01",
    eyebrow: "Give financially",
    title: "Donate to Obroni Akunafo Kuo",
    body: "Every cedi donated goes directly to supporting widows, orphans, persons with disabilities and the aged. You can give once or choose to support monthly. All donations are received through our confirmed accounts.",
    bullets: [
      "MTN Mobile Money: 0541 597 436",
      "Ecobank Ghana — Account: Obroni Akunafo Kuo · No. 0011020008964",
      "Give once or support monthly — your choice",
      "All finances independently audited annually",
    ],
    primary: { label: "Donate now", href: "/donate", variant: "primary" as const },
    secondary: {
      label: "View payment details",
      href: "/donate#step-payment",
    },
    panel: {
      title: "Make a donation",
      accent: "text-lime",
      bg: "bg-forest",
      icon: Heart,
    },
    reverse: false,
  },
  {
    no: "02",
    eyebrow: "Give your time",
    title: "Volunteer with us",
    body: "Whether you have professional skills, practical experience or simply a willing heart — there is a place for you. We welcome volunteers across our four programme areas and in community outreach activities throughout the Ahafo Region.",
    bullets: [
      "Community outreach and education support",
      "Healthcare visits and companionship for the aged",
      "Skills training and empowerment facilitation",
      "Disability inclusion and direct beneficiary support",
      "Fundraising, events and professional support",
    ],
    primary: {
      label: "Register to volunteer",
      href: "/volunteer",
      variant: "purple" as const,
    },
    secondary: { label: "Learn more", href: "/volunteer" },
    panel: {
      title: "Become a volunteer",
      accent: "text-violet",
      bg: "bg-[#3B1D8F]",
      icon: HandHeart,
    },
    reverse: true,
  },
  {
    no: "03",
    eyebrow: "Organisational collaboration",
    title: "Partner with Obroni Akunafo Kuo",
    body: "We welcome organisations — local and international — interested in supporting vulnerable communities through partnerships, resources, expertise or community initiatives. Our governance structure ensures accountability and transparency at every level.",
    bullets: [
      "Corporate social responsibility and CSR alignment",
      "In-kind support, resources and expertise",
      "Staff volunteering and community engagement",
      "Strategic partnership and programme co-funding",
      "Board of Trustees + annual audit — full accountability",
    ],
    primary: {
      label: "Request a meeting",
      href: "/partner",
      variant: "orange" as const,
    },
    secondary: { label: "View partnership info", href: "/partner" },
    panel: {
      title: "Partner with us",
      accent: "text-gold",
      bg: "bg-[#8A3D05]",
      icon: Landmark,
    },
    reverse: false,
  },
] as const;

const whyWork = [
  {
    icon: HeartHandshake,
    title: "Purpose-led",
    body: "Work that directly changes lives in your community.",
  },
  {
    icon: Users,
    title: "Community first",
    body: "Deep roots in local communities and relationships.",
  },
  {
    icon: ShieldCheck,
    title: "Accountable",
    body: "A governed, audited organisation you can trust.",
  },
  {
    icon: Sprout,
    title: "Growing",
    body: "Expanding programmes and reach year on year.",
  },
] as const;

export default async function GetInvolvedPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-oak py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
            <span className="size-1.5 rounded-full bg-lime" />
            Choose how you want to make a difference
          </span>

          <h1 className="display-1 mx-auto mt-6 max-w-3xl">
            There is a place for{" "}
            <span className="text-lime">everyone</span> here
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/55 sm:text-base">
            Whether you give, serve, partner or join our team — every
            contribution directly supports the widows, orphans, persons with
            disabilities and the aged we serve across Ghana&apos;s Ahafo
            Region.
          </p>

          <div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-3">
            {heroCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={cn(
                    "flex flex-col items-center rounded-[14px] border p-5 text-center transition-colors",
                    card.className,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full",
                      card.iconClass,
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="mt-3 text-sm font-semibold">
                    {card.title}
                  </span>
                  <span className="mt-1 text-[11px] leading-relaxed text-white/45">
                    {card.body}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-white/45">
            {[
              "800–1,000 beneficiaries",
              "200+ PWDs supported",
              `Founded ${org.founded}`,
              "Audited annually",
              "Non-profit · Non-partisan",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-lime" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { value: "800+", label: "Beneficiaries and support reaches" },
              { value: "200+", label: "Persons with Disabilities" },
              { value: "4", label: "Core programme areas" },
              { value: "10yrs", label: "Of community service in 2026" },
            ].map((stat) => (
              <div key={stat.label} className="bg-ink px-4 py-5">
                <p className="text-xl font-semibold text-grass">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-white/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-oak flex flex-col gap-10">
          {ways.map((way, index) => (
            <div key={way.no}>
              <p className="eyebrow text-muted">Way {way.no}</p>
              <div
                className={cn(
                  "mt-4 grid overflow-hidden rounded-[18px] border border-line lg:grid-cols-2",
                  index % 2 === 1 && "bg-paper",
                )}
              >
                <div
                  className={cn(
                    "relative flex min-h-[280px] flex-col justify-between overflow-hidden p-8 text-white sm:p-10",
                    way.panel.bg,
                    way.reverse ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 size-48 rounded-full bg-white/[0.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-16 -left-10 size-56 rounded-full bg-black/10"
                  />
                  <span className="relative flex size-10 items-center justify-center rounded-full bg-white/10">
                    <way.panel.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="display-2 relative mt-16 max-w-[10ch] text-white">
                    {way.panel.title.split(" ").map((word, i) => (
                      <span
                        key={`${word}-${i}`}
                        className={cn(
                          i === way.panel.title.split(" ").length - 1 &&
                            way.panel.accent,
                        )}
                      >
                        {word}
                        {i < way.panel.title.split(" ").length - 1 ? " " : ""}
                      </span>
                    ))}
                  </h2>
                  <p className="relative mt-4 max-w-xs text-[12px] leading-relaxed text-white/50">
                    {way.no === "01"
                      ? "Your financial contribution — however large or small — directly funds food relief, education, healthcare and shelter for the most vulnerable in our communities."
                      : way.no === "02"
                        ? "Contribute your time, skills and compassion to the communities we serve. Volunteers are the heart of everything we do."
                        : "Organisations interested in community impact, CSR initiatives or social investment are welcome to explore a partnership with Obroni Akunafo Kuo."}
                  </p>
                </div>

                <div
                  className={cn(
                    "bg-white p-8 sm:p-10",
                    way.reverse ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <p className="eyebrow text-grass">{way.eyebrow}</p>
                  <h3 className="display-3 mt-3">{way.title}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-body">
                    {way.body}
                  </p>
                  <BulletList items={way.bullets} className="mt-5" />
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <ButtonLink href={way.primary.href} variant={way.primary.variant}>
                      <Heart className="size-4" aria-hidden="true" />
                      {way.primary.label}
                    </ButtonLink>
                    <Link
                      href={way.secondary.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink hover:text-grass"
                    >
                      {way.secondary.label}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Way 04 */}
          <div id="careers" className="scroll-mt-24">
            <p className="eyebrow text-muted">Way 04</p>
            <div className="mt-4 grid gap-8 rounded-[18px] border border-line bg-paper p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-amber/10 text-amber">
                  <Briefcase className="size-5" aria-hidden="true" />
                </span>
                <h2 className="display-3 mt-5">Join our team</h2>
                <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-body">
                  We are always looking for passionate, mission-driven people to
                  join the Obroni Akunafo Kuo family. Whether in programme
                  delivery, administration, communications or field work — if
                  you believe in what we do, we want to hear from you.
                </p>

                <div className="mt-5 rounded-[10px] border border-amber/30 bg-amber/[0.06] p-4">
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-amber">
                    <Clock className="size-3.5" aria-hidden="true" />
                    No open positions at this time
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                    Specific roles and job listings will be added here once
                    confirmed by Obroni Akunafo Kuo. Check back or contact us to
                    express your interest.
                  </p>
                </div>

                <ButtonLink href="/contact" variant="dark" className="mt-5">
                  <Mail className="size-4" aria-hidden="true" />
                  Express your interest
                </ButtonLink>
              </div>

              <div>
                <p className="eyebrow text-muted">Why work with us</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {whyWork.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-[10px] border border-line bg-white p-4"
                      >
                        <Icon className="size-4 text-grass" aria-hidden="true" />
                        <p className="mt-2 text-[12px] font-semibold text-ink">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                          {item.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-paper py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow>Common questions</Eyebrow>
          <h2 className="display-2 mt-4">Frequently asked</h2>
          <p className="mt-3 max-w-xl text-sm text-body">
            Answers to the most common questions from people who want to get
            involved.
          </p>

          <Accordion
            items={faqs.map((faq) => ({ q: faq.q, a: faq.a }))}
            defaultOpen={[0, 1, 2, 3, 4, 5]}
            className="mt-9"
          />

          <div className="mt-10 flex flex-col gap-5 rounded-[14px] border border-line bg-mint p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-sm font-semibold text-ink">
                Still have questions? We&apos;d love to hear from you.
              </p>
              <p className="mt-1 text-[12px] text-muted">
                Reach us directly at{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="underline decoration-grass/40 underline-offset-2 hover:text-ink"
                >
                  {settings.email}
                </a>{" "}
                or call {settings.phonePrimary} / {settings.phoneSecondary}.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <ButtonLink href="/contact" size="sm">
                <Mail className="size-3.5" aria-hidden="true" />
                Contact us
              </ButtonLink>
              <a
                href={`tel:+233${settings.phonePrimary.replace(/\D/g, "").replace(/^0/, "")}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-ink/15 px-4 text-[13px] font-semibold text-ink hover:bg-white"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                Call us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
