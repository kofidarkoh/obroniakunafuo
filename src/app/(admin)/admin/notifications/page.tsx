import Link from "next/link";
import { ArrowRight, Bell, Plus } from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import {
  deleteAdminNotification,
  listAdminNotifications,
} from "@/lib/data/content";
import { cn } from "@/lib/utils";

export default async function AdminNotificationsPage() {
  const notifications = await listAdminNotifications();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteAdminNotification(id);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notifications & announcements"
        description={
          "Publish public announcements that appear on the website's notifications page. " +
          "Drafts are hidden from the public."
        }
        action={
          <Link
            href="/admin/notifications/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-grass px-4 text-[12px] font-medium text-white hover:bg-moss"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New announcement
          </Link>
        }
      />

      {notifications.length === 0 ? (
        <AdminCard>
          <EmptyState
            title="No announcements yet"
            description={
              "Create your first announcement to share news with the public. " +
              "Published announcements appear on the notifications page."
            }
            action={
              <Link
                href="/admin/notifications/new"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-grass px-4 text-[12px] font-medium text-white hover:bg-moss"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                New announcement
              </Link>
            }
          />
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {notifications.map((item) => (
            <AdminCard
              key={item.slug}
              className="flex flex-col p-5 group"
            >
              <form action={handleDelete} className="mt-4">
                <input type="hidden" name="id" value={item.slug} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold text-ink truncate max-w-[200px]">
                        {item.title}
                      </p>
                      <StatusPill status={item.status} />
                    </div>
                    <p className="mt-1 text-[10.5px] text-muted">
                      {formatDateTime(item.date)}
                    </p>
                    <p className="mt-2 max-w-full truncate text-[11px] text-muted">
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex items-end gap-2 shrink-0">
                    <Link
                      href={`/admin/notifications/${item.slug}`}
                      className="text-[10.5px] font-medium text-grass hover:text-forest"
                    >
                      Edit
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <button
                      type="submit"
                      className="text-[10.5px] font-medium text-coral hover:text-rose-600"
                      onClick={(e) => {
                        if (
                          !window.confirm(
                            `Delete announcement “${item.title}"?`,
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
