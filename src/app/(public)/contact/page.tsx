import type { Metadata } from "next";
import {
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { CopyButton } from "@/components/site/copy-button";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/site/social-icons";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { getSiteSettings } from "@/lib/data/content";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with Obroni Akunafo Kuo. Call, email or send us a message — we aim to respond within 2–3 working days.",
};

const orgInfo = [
  ["Founded", "2016"],
  ["Reg. No.", org.regNo],
  ["TIN", org.tin],
  ["Type", "Non-profit NGO"],
  ["Audit", "Annual"],
  ["Location", "Mim, Ahafo, Ghana"],
] as const;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phones = [settings.phonePrimary, settings.phoneSecondary].filter(
    Boolean,
  );
  const phoneLinks = phones.map((phone) =>
    `+233${phone.replace(/\D/g, "").replace(/^0/, "")}`,
  );
  const whatsappHref = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;

  const heroContacts = [
    {
      label: "Phone (Primary)",
      value: phones[0] ?? "",
      href: `tel:${phoneLinks[0] ?? ""}`,
      icon: Phone,
      tone: "text-grass",
      tile: "bg-grass/15 text-grass",
      copy: phones[0] ?? "",
    },
    {
      label: "Phone (Secondary)",
      value: phones[1] ?? "",
      href: `tel:${phoneLinks[1] ?? ""}`,
      icon: Phone,
      tone: "text-grass",
      tile: "bg-grass/15 text-grass",
      copy: phones[1] ?? "",
    },
    {
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      icon: Mail,
      tone: "text-orange",
      tile: "bg-orange/15 text-orange",
      copy: settings.email,
    },
    {
      label: "Head office",
      value: settings.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
      icon: MapPin,
      tone: "text-white/60",
      tile: "bg-white/10 text-white/60",
      copy: settings.address,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-oak grid gap-10 py-14 sm:py-18 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-grass/30 bg-grass/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-grass">
              <span className="size-1.5 rounded-full bg-lime" />
              We&apos;d love to hear from you
            </span>

            <h1 className="display-1 mt-6 max-w-xl">
              Get in touch{" "}
              <span className="block text-grass">with our team</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-base">
              Whether you want to donate, volunteer, explore a partnership, or
              simply learn more about what we do — we are here and we would love
              to hear from you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#message" size="lg">
                <Send className="size-4" aria-hidden="true" />
                Send a message
              </ButtonLink>
              <a
                href={`tel:${phoneLinks[0] ?? ""}`}
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-white/20 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
              >
                <Phone className="size-4" aria-hidden="true" />
                Call us directly
              </a>
            </div>
          </div>

          <div className="space-y-3">
            {heroContacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <div
                  key={contact.label}
                  className="flex items-center gap-4 rounded-[12px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-[8px] ${contact.tile}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-white/40">
                      {contact.label}
                    </p>
                    <a
                      href={contact.href}
                      target={contact.label === "Head office" ? "_blank" : undefined}
                      rel={
                        contact.label === "Head office"
                          ? "noreferrer"
                          : undefined
                      }
                      className="mt-0.5 block truncate text-[13.5px] font-medium text-white hover:text-grass"
                    >
                      {contact.value}
                    </a>
                  </div>
                  <CopyButton value={contact.copy} label={contact.label} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section id="message" className="scroll-mt-24 bg-paper">
        <div className="container-oak grid lg:grid-cols-[1fr_420px]">
          <div className="py-12 sm:py-16 lg:pr-14">
            <Eyebrow>Send us a message</Eyebrow>
            <h2 className="display-2 mt-4">How can we help you?</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
              Fill in the form below and a member of our team will get back to
              you as soon as possible — usually within 2–3 working days.
            </p>
            <ContactForm />
          </div>

          <aside className="border-t border-line bg-white py-12 lg:border-l lg:border-t-0 lg:pl-10 lg:pr-0">
            <Eyebrow>Contact directly</Eyebrow>

            <div className="mt-5 space-y-3">
              <div className="rounded-[10px] border border-line bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-[8px] bg-mint text-moss">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Phone
                </p>
                <div className="mt-2 space-y-1.5">
                  <div>
                    <a
                      href={`tel:${phoneLinks[0] ?? ""}`}
                      className="text-[12.5px] font-semibold text-ink hover:text-grass"
                    >
                      {phones[0]}
                    </a>
                    <p className="text-[10px] text-muted">
                      Primary number — Mr. Bernard Adu Tutu
                    </p>
                  </div>
                  <div>
                    <a
                      href={`tel:${phoneLinks[1] ?? ""}`}
                      className="text-[12.5px] font-semibold text-ink hover:text-grass"
                    >
                      {phones[1]}
                    </a>
                    <p className="text-[10px] text-muted">Secondary number</p>
                  </div>
                </div>
                <a
                  href={`tel:${phoneLinks[0] ?? ""}`}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-grass hover:text-forest"
                >
                  <Phone className="size-3" aria-hidden="true" />
                  Call now
                </a>
              </div>

              <div className="rounded-[10px] border border-line bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-[8px] bg-orange/10 text-orange">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-2 block break-all text-[12.5px] font-semibold text-ink hover:text-grass"
                >
                  {settings.email}
                </a>
                <p className="mt-1 text-[10px] text-muted">
                  We aim to respond within 2–3 working days
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-grass hover:text-forest"
                >
                  <Mail className="size-3" aria-hidden="true" />
                  Send email
                </a>
              </div>

              <div className="rounded-[10px] border border-line bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-[8px] bg-mint text-moss">
                  <MessageCircle className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                  WhatsApp
                </p>
                <p className="mt-2 text-[12.5px] font-semibold text-ink">
                  {phones[0]}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  Message us on WhatsApp for quick responses
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-grass hover:text-forest"
                >
                  Open WhatsApp
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <p className="eyebrow text-muted">Head office location</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-line bg-white">
                <div
                  className="relative flex h-44 items-center justify-center bg-forest"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(circle at 50% 45%, rgba(34,197,34,0.18), transparent 55%)",
                    backgroundSize: "26px 26px, 26px 26px, 100% 100%",
                  }}
                >
                  <div className="text-center">
                    <span className="mx-auto flex size-8 items-center justify-center rounded-full bg-lime text-forest shadow-[0_0_0_8px_rgba(34,197,34,0.15)]">
                      <MapPin className="size-4" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-[10px] text-white/60">
                      Mim, Ahafo Region, Ghana
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[12.5px] font-semibold text-ink">
                    Mim, Ahafo Region
                  </p>
                  <p className="mt-1 text-[10.5px] text-muted">
                    Ghana — Head office of Obroni Akunafo Kuo
                  </p>
                  <a
                    href="https://maps.google.com/?q=Mim,+Ahafo+Region,+Ghana"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-grass hover:text-forest"
                  >
                    <MapPin className="size-3" aria-hidden="true" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Organisation info */}
            <div className="mt-8">
              <p className="eyebrow text-muted">Organisation information</p>
              <div className="mt-3 rounded-[10px] bg-ink p-5 text-white">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-grass text-[10px] font-bold text-white">
                    OAK
                  </span>
                  <div>
                    <p className="text-[11.5px] font-semibold">
                      Obroni Akunafo Kuo
                    </p>
                    <p className="text-[8.5px] text-white/40">{org.motto}</p>
                  </div>
                </div>
                <dl className="mt-1">
                  {orgInfo.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-2.5 text-[10.5px] last:border-0"
                    >
                      <dt className="text-white/40">{label}</dt>
                      <dd className="flex items-center gap-1 font-medium text-white/85">
                        {value}
                        {label === "Audit" ? (
                          <Check className="size-3 text-lime" aria-hidden="true" />
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-8">
              <p className="eyebrow text-muted">Follow us</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "Facebook", Icon: FacebookIcon, href: settings.facebook },
                  { label: "Instagram", Icon: InstagramIcon, href: settings.instagram },
                  { label: "WhatsApp", Icon: WhatsAppIcon, href: whatsappHref },
                ].map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 items-center justify-center gap-1.5 rounded-[8px] border border-line bg-white text-[10.5px] font-medium text-ink transition-colors hover:bg-paper"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-8 flex items-start gap-2 text-[10px] leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-grass" />
              Your details are handled with care and never shared with third
              parties.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
