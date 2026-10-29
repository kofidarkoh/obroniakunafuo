"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  Bell,
  ExternalLink,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { logoutAction } from "@/app/admin-actions";
import { cn } from "@/lib/utils";

type UnreadCounts = {
  contacts: number;
  volunteers: number;
  partnerships: number;
  donations: number;
};

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/volunteers", label: "Volunteers", icon: Users },
  { href: "/admin/partnerships", label: "Partnerships", icon: Building2 },
  { href: "/admin/stories", label: "Stories", icon: FileText },
  { href: "/admin/programmes", label: "Programmes", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

const unreadByRoute: Record<string, keyof UnreadCounts> = {
  "/admin/donations": "donations",
  "/admin/messages": "contacts",
  "/admin/volunteers": "volunteers",
  "/admin/partnerships": "partnerships",
};

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/notifications": "Notifications",
  "/admin/donations": "Donations",
  "/admin/messages": "Messages",
  "/admin/volunteers": "Volunteers",
  "/admin/partnerships": "Partnerships",
  "/admin/stories": "Stories",
  "/admin/programmes": "Programmes",
  "/admin/settings": "Settings",
};

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminShell({
  email,
  children,
  unreadCounts,
}: {
  email: string;
  children: React.ReactNode;
  unreadCounts?: UnreadCounts;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const totalUnread =
    (unreadCounts?.contacts ?? 0) +
    (unreadCounts?.volunteers ?? 0) +
    (unreadCounts?.partnerships ?? 0) +
    (unreadCounts?.donations ?? 0);
  const title =
    Object.entries(titles).find(([path]) => isActive(pathname, path))?.[1] ??
    "Admin";

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-0.5 px-3">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActive(pathname, link.href);
        const countKey = unreadByRoute[link.href];
        const count = countKey ? unreadCounts?.[countKey] : undefined;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors",
              active
                ? "bg-grass/15 font-semibold text-lime"
                : "text-white/55 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {link.label}
            {count !== undefined && count > 0 ? (
              <span className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-amber text-[9px] font-semibold text-white" aria-label={`${count} unread`}>
                {count}
              </span>
            ) : null}
            {active ? (
              <span className="ml-auto size-1.5 rounded-full bg-lime" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/10 bg-ink lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo />
        </div>
        <div className="px-6 pb-3 pt-6">
          <p className="eyebrow text-white/30">Administration</p>
        </div>
        {nav}
        {totalUnread !== undefined && totalUnread > 0 && (
          <div className="mt-2 px-4 py-2 border border-amber/25 bg-amber/5">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-amber">
              <MessageSquare className="size-3" aria-hidden="true" />
              {totalUnread} unread submission{totalUnread === 1 ? "" : "s"}
            </span>
          </div>
        )}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-white/50 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View public site
          </Link>
          <div className="mt-2 flex items-center gap-2 px-3 py-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-grass/20 text-[10px] font-semibold text-lime">
              {email.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate text-[11px] text-white/50">
              {email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="text-white/40 hover:text-white"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/60"
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-ink">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-white/60"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 pb-3 pt-5">
              <p className="eyebrow text-white/30">Administration</p>
            </div>
            {nav}
            {totalUnread !== undefined && totalUnread > 0 && (
              <div className="mt-2 px-4 py-2 border border-amber/25 bg-amber/5">
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-amber">
                  <MessageSquare className="size-3" aria-hidden="true" />
                  {totalUnread} unread submission{totalUnread === 1 ? "" : "s"}
                </span>
              </div>
            )}
            <div className="border-t border-white/10 p-4">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-white/50"
                >
                  <LogOut className="size-3.5" aria-hidden="true" />
                  Sign out
                </button>
              </form>
            </div>
          </aside>
        </div>
      ) : null}

      {/* Main */}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-ink">{title}</h1>
              <p className="text-[10px] text-muted">
                Obroni Akunafo Kuo · Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[11px] font-medium text-body hover:bg-paper sm:flex"
            >
              <ExternalLink className="size-3" aria-hidden="true" />
              View site
            </Link>
            <span className="hidden max-w-[180px] truncate text-[11px] text-muted sm:block">
              {email}
            </span>
            {totalUnread !== undefined && totalUnread > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-amber text-[9px] font-semibold text-amber" aria-label={`${totalUnread} unread submissions`}>
                <MessageSquare className="size-2" aria-hidden="true" />
                {totalUnread}
              </span>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex h-8 items-center gap-1.5 rounded-lg bg-ink px-3 text-[11px] font-medium text-white hover:bg-ink-900"
              >
                <LogOut className="size-3" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
