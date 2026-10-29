import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminNotification } from "@/lib/data/content";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { NotificationForm } from "@/app/(admin)/admin/notifications/new/page";

export const dynamic = "force-dynamic";

export default async function EditNotificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notification = await getAdminNotification(slug);

  if (!notification) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit announcement"
          description="This announcement no longer exists."
        />
        <AdminCard className="p-5 sm:p-6">
          <p className="text-[12px] text-muted">
            The announcement you are looking for could not be found.
          </p>
          <Link
            href="/admin/notifications"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to announcements
          </Link>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit: ${notification.title}`}
        description="Update the announcement details. Changes will be reflected on the public notifications page."
        action={
          <Link
            href="/admin/notifications"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to announcements
          </Link>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <NotificationForm
          existingSlug={notification.slug}
          notification={{
            slug: notification.slug,
            title: notification.title,
            summary: notification.summary,
            content: notification.content,
            date: notification.date,
            status: notification.status,
          }}
        />
      </AdminCard>
    </div>
  );
}
