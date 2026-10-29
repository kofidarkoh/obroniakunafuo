import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/site/social-icons";
import type { OrgContact } from "@/lib/data/content";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
} as const;

const columns = [
  {
    title: "Organisation",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/about#leadership" },
      { label: "Governance", href: "/about#governance" },
      { label: "Annual reports", href: "/stories#impact" },
      { label: "News", href: "/stories" },
      { label: "Announcements", href: "/notifications" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Partner with us", href: "/partner" },
      { label: "Campaigns", href: "/get-involved" },
      { label: "Careers", href: "/get-involved#careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "FAQ", href: "/get-involved#faq" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
      { label: "Financial statements", href: "/stories#impact" },
    ],
  },
] as const;

export function Footer({ contact }: { contact: OrgContact }) {
  return (
    <footer className="bg-ink text-white">
      <div className="container-oak py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-sm leading-relaxed text-white/50">
              A registered Ghanaian NGO restoring hope, dignity and love to
              widows, orphans, persons with disabilities and the aged in the
              Ahafo Region.
            </p>

            <div className="mt-7 space-y-3 text-sm text-white/60">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-lime" />
                {contact.addressFull}
              </p>
              <p className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-lime" />
                <span>
                  {contact.phones.map((phone, i) => (
                    <span key={phone}>
                      <a
                        href={`tel:${contact.phoneLinks[i]}`}
                        className="hover:text-white"
                      >
                        {phone}
                      </a>
                      {i < contact.phones.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-lime" />
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all hover:text-white"
                >
                  {contact.email}
                </a>
              </p>
            </div>

            <div className="mt-7 flex items-center gap-2">
              {contact.socials.map((social) => {
                const Icon =
                  socialIcons[social.icon as keyof typeof socialIcons] ??
                  WhatsAppIcon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full border border-white/12 text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="eyebrow text-white/40">{column.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {contact.name}. All rights reserved.
          </p>
          <p>
            Registered NGO · {contact.regNo} · TIN {contact.tin}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function MinimalFooter({ contact }: { contact: OrgContact }) {
  return (
    <footer className="bg-ink text-white">
      <div className="container-oak flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="text-[11px] text-white/35">
          © {new Date().getFullYear()} {contact.name} · Registered NGO, Ghana
        </p>
      </div>
    </footer>
  );
}
