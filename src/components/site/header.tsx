"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import type { OrgContact } from "@/lib/data/content";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ contact }: { contact: OrgContact }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink text-white">
      <div className="container-oak flex h-[72px] items-center justify-between gap-6 lg:h-[80px]">
        <Logo className="min-w-0" />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-lg px-3.5 py-2 text-[13.5px] transition-colors",
                isActive(item.href)
                  ? "font-semibold text-white"
                  : "text-white/60 hover:text-white",
              )}
            >
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-lime" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-full border border-white/20 px-5 text-[13px] font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white"
          >
            Contact
          </Link>
          <ButtonLink href="/donate" size="sm" className="h-10 px-5">
            <Heart className="size-3.5" aria-hidden="true" />
            Donate now
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden",
          open
            ? "fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto border-t border-white/10 bg-ink"
            : "hidden",
        )}
      >
        <div className="container-oak flex min-h-full flex-col py-6">
          <nav aria-label="Mobile primary" className="flex flex-col">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-white/[0.07] py-4 text-lg",
                  isActive(item.href)
                    ? "font-semibold text-white"
                    : "text-white/70",
                )}
              >
                <span>{item.label}</span>
                <span className="text-[11px] text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <div onClick={() => setOpen(false)}>
              <ButtonLink href="/donate" size="lg" className="w-full">
                <Heart className="size-4" aria-hidden="true" />
                Donate now
              </ButtonLink>
            </div>
            <a
              href={`tel:${contact.phoneLinks[0]}`}
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-white/20 text-sm font-medium text-white"
            >
              <Phone className="size-4" aria-hidden="true" />
              {contact.phones[0]}
            </a>
          </div>

          <p className="mt-auto pt-10 text-xs leading-relaxed text-white/40">
            {contact.addressFull}
            <br />
            Reg. {contact.regNo} · TIN {contact.tin}
          </p>
        </div>
      </div>
    </header>
  );
}
