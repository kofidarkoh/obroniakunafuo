import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Clock, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/primitives";
import { listNotifications } from "@/lib/data/content";
import { formatDateTime } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "Notifications & Announcements",
    template: "%s | Obroni Akunafo Kuo",
  },
  description:
    "Latest news, announcements and updates from Obroni Akunafo Kuo — including appeals, campaign launches, volunteer needs and donation milestones in the Ahafo Region.",
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Obroni Akunafo Kuo",
    title: "Notifications & Announcements | Obroni Akunafo Kuo",
    description:
      "Latest news, announcements and updates from Obroni Akunafo Kuo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notifications & Announcements",
    description:
      "Latest news, announcements and updates from Obroni Akunafo Kuo.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/notifications" },
};

export default async function NotificationsPage() {
  const notifications = await listNotifications();

  return (
    <div className="space-y-8">
      <section className="bg-ink text-white py-16 sm:py-20">
        <div className="container-oak">
          <Eyebrow tone="light">
            <Bell className="size-4" aria-hidden="true" />
            Notifications &amp; announcements
          </Eyebrow>
          <h1 className="display-1 mt-4 max-w-2xl">
            Latest updates from Obroni Akunafo Kuo
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60">
            Stay informed about our latest appeals, campaign launches, volunteer
            needs, donation milestones and community events across the Ahafo
            Region.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-20">
        <div className="container-oak">
          {notifications.length === 0 ? (
            <div className="rounded-[14px] border border-line bg-white p-10 sm:p-12 text-center">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-amber/10 mx-auto mb-4 text-amber">
                <Bell className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-ink">
                No announcements yet
              </h3>
              <p className="mt-2 text-[12px] text-muted">
                Check back soon for the latest news and updates from Obroni
                Akunafo Kuo.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notifications.map((item) => (
                <article
                  key={item.slug}
                  className="flex flex-col overflow-hidden rounded-[14px] border border-line bg-white hover:border-grass transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
                    <div>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {formatDateTime(item.date)}
                      </span>
                      <h3 className="mt-1.5 text-[15px] font-semibold text-ink group-hover:text-grass">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber">
                      <Bell className="size-4" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="bg-white/50 px-5 sm:px-6 pb-5 sm:pb-6">
                    <Link
                      href={`/notifications/${item.slug}`}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-line px-4 py-2.5 text-[11.5px] font-medium text-ink hover:bg-grass hover:text-forest transition-colors"
                    >
                      Read announcement
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
