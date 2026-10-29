import type { Metadata } from "next";
import Link from "next/link";
import { Bell, ChevronLeft, Clock } from "lucide-react";
import { Eyebrow } from "@/components/ui/primitives";
import { getNotification } from "@/lib/data/content";
import { formatDateTime } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const notification = await getNotification(slug);

  if (!notification) {
    return {
      title: "Notification not found",
      description: "This announcement is no longer available.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: {
      default: notification.title,
      template: "%s | Obroni Akunafo Kuo",
    },
    description: notification.summary,
    openGraph: {
      type: "article",
      locale: "en_GH",
      siteName: "Obroni Akunafo Kuo",
      title: notification.title,
      description: notification.summary,
      publishedTime: notification.date,
      authors: ["Obroni Akunafo Kuo"],
    },
    twitter: {
      card: "summary_large_image",
      title: notification.title,
      description: notification.summary,
    },
    robots: { index: true, follow: true },
  };
};

export default async function NotificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notification = await getNotification(slug);

  if (!notification) {
    return (
      <div className="container-oak py-16 sm:py-20">
        <Eyebrow tone="light">Notifications &amp; announcements</Eyebrow>
        <h1 className="display-1 mt-4">Notification not found</h1>
        <p className="mt-2 text-[12px] text-muted">
          This announcement is no longer available.
        </p>
        <Link
          href="/notifications"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-[11.5px] font-medium text-ink hover:bg-paper"
        >
          <ChevronLeft className="size-3" />
          Back to announcements
        </Link>
      </div>
    );
  }

  const paragraphs = notification.content
    .split("\n\n")
    .filter((p: string) => p.trim().length > 0);

  return (
    <article className="container-oak py-16 sm:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/notifications"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-[11.5px] font-medium text-ink hover:bg-paper"
          >
            <ChevronLeft className="size-3" />
            Back to announcements
          </Link>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            {formatDateTime(notification.date)}
          </span>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber">
            <Bell className="size-4" aria-hidden="true" />
          </div>
          <div>
            <Eyebrow tone="light">
              Notifications &amp; announcements
            </Eyebrow>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-[36px]">
              {notification.title}
            </h1>
            <p className="mt-1 text-[11px] text-muted">
              Published {formatDateTime(notification.date)}
            </p>
          </div>
        </div>

        <div className="prose prose-sm sm:prose-base lg:prose-lg text-body max-w-none">
          {paragraphs.map((p: string, i: number) => (
            <p key={i} className="mb-5 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
