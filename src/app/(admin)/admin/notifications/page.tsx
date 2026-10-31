import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  AdminSearchForm,
  EmptyState,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import {
  deleteAdminNotification,
  listAdminNotifications,
  listAdminNotificationsPaginated,
} from "@/lib/data/content";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const filters = ["all", "draft", "published"] as const;
const PAGE_SIZE = 25;

type PageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
};

export default async function AdminNotificationsPage({
  searchParams,
}: PageProps) {
  const { status, search, page } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [{ items, total }, allNotifications] = await Promise.all([
    listAdminNotificationsPaginated({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search,
      status: active,
    }),
    listAdminNotifications(),
  ]);

  const pageCount = Math.ceil(total / PAGE_SIZE);
  const hasFilters = Boolean(search) || active !== "all";

  async function handleDelete(formData: FormData) {
    "use server";
    const { requireAdmin } = await import("@/lib/auth");
    const { logAdminAction } = await import("@/lib/audit");
    const session = await requireAdmin();
    const id = formData.get("id") as string;
    if (id) {
      await deleteAdminNotification(id);
      await logAdminAction({
        actor: session.email,
        action: "delete",
        entityType: "notification",
        entityId: id,
      });
    }
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
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emblem px-4 text-[12px] font-medium text-white hover:bg-forest-800"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New announcement
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <AdminSearchForm
          action="/admin/notifications"
          placeholder="Search title, summary…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/notifications?search=${search ?? ""}&page=1`
                : `/admin/notifications?status=${filter}&search=${search ?? ""}&page=1`
            }
            className={cn(
              "rounded-lg px-3 py-1.5 text-[11.5px] capitalize transition-colors",
              active === filter
                ? "bg-ink font-semibold text-white"
                : "text-muted hover:bg-paper hover:text-ink",
            )}
          >
            {filter}
            <span className="ml-1.5 text-[9.5px] opacity-60">
              {filter === "all"
                ? allNotifications.length
                : allNotifications.filter((item) => item.status === filter).length}
            </span>
          </Link>
        ))}
        {hasFilters ? (
          <Link
            href="/admin/notifications"
            className="text-[11px] font-medium text-grass hover:text-forest"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <AdminCard>
          <EmptyState
            title="No announcements in this view"
            description={
              hasFilters
                ? "No announcements match the current filters."
                : "Create your first announcement to share news with the public. " +
                  "Published announcements appear on the notifications page."
            }
            action={
              hasFilters ? (
                <Link
                  href="/admin/notifications"
                  className="text-[11px] font-semibold text-grass"
                >
                  Clear filters
                </Link>
              ) : (
                <Link
                  href="/admin/notifications/new"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emblem px-4 text-[12px] font-medium text-white hover:bg-forest-800"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  New announcement
                </Link>
              )
            }
          />
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <AdminCard key={item.slug} className="flex flex-col p-5 group">
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

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-[10px] text-muted">
            Showing {items.length} of {total} announcements
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/notifications?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
                className="rounded-lg px-3 py-1.5 border border-line text-[11.5px] hover:bg-paper"
              >
                Prev
              </Link>
            )}
            <span className="px-3 py-1.5 text-[11px] text-muted">
              Page {currentPage} of {pageCount}
            </span>
            {currentPage < pageCount && (
              <Link
                href={`/admin/notifications?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
                className="rounded-lg px-3 py-1.5 border border-line text-[11.5px] hover:bg-paper"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}