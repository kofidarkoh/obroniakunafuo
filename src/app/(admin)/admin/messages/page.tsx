import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { setContactStatusAction } from "@/app/admin-actions";
import { SubmissionStatusActions } from "@/components/admin/status-actions";
import {
  AdminCard,
  AdminPageHeader,
  AdminSearchForm,
  AdminStat,
  EmptyState,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import { listContactsPaginated } from "@/lib/data/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const filters = ["all", "new", "reviewed", "archived"] as const;
const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
};

export default async function AdminMessagesPage({
  searchParams,
}: PageProps) {
  const { status, search, page } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const { items, total, counts } = await listContactsPaginated({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search,
    status: active,
  });

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        description={
          active === "all"
            ? "Enquiries submitted through the public contact form. Reply by email or phone, then mark the message as reviewed."
            : `Messages with status “${active}”. Reply by email or phone, then mark the message as reviewed.`
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStat label="All messages" value={counts.all ?? 0} />
        <AdminStat
          label="New"
          value={counts.new ?? 0}
          tone="amber"
        />
        <AdminStat
          label="Reviewed"
          value={counts.reviewed ?? 0}
          tone="green"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <AdminSearchForm
          action="/admin/messages"
          placeholder="Search name, email, message…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/messages?search=${search ?? ""}&page=1`
                : `/admin/messages?status=${filter}&search=${search ?? ""}&page=1`
            }
            className={cn(
              "rounded-lg px-3 py-1.5 text-[11.5px] capitalize transition-colors",
              active === filter
                ? "bg-ink font-semibold text-white"
                : "text-muted hover:bg-white hover:text-ink",
            )}
          >
            {filter}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <AdminCard>
          <EmptyState
            title="No messages in this view"
            description="Messages submitted through the contact form will appear here."
          />
        </AdminCard>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {items.map((message) => (
            <AdminCard key={message.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="text-[13px] font-semibold text-ink hover:text-grass"
                    >
                      {message.name}
                    </Link>
                    <StatusPill status={message.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-muted">
                    <a
                      href={`mailto:${message.email}`}
                      className="flex items-center gap-1 hover:text-ink"
                    >
                      <Mail className="size-3" aria-hidden="true" />
                      {message.email}
                    </a>
                    {message.phone ? (
                      <a
                        href={`tel:${message.phone}`}
                        className="flex items-center gap-1 hover:text-ink"
                      >
                        <Phone className="size-3" aria-hidden="true" />
                        {message.phone}
                      </a>
                    ) : null}
                  </div>
                </div>
                <p className="shrink-0 text-[9.5px] text-muted">
                  {formatDateTime(message.createdAt)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-paper px-2 py-0.5 text-[9.5px] font-medium text-body">
                  {message.reason}
                </span>
                <span className="text-[9.5px] text-muted">
                  Reply via {message.preferredResponse}
                </span>
                {message.organisation ? (
                  <span className="text-[9.5px] text-muted">
                    · {message.organisation}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 flex-1 rounded-lg bg-paper px-4 py-3 text-[11.5px] leading-relaxed text-body">
                {message.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="text-[10.5px] font-semibold text-ink hover:text-grass"
                  >
                    Open details
                  </Link>
                  <a
                    href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.reason)}`}
                    className="text-[10.5px] font-semibold text-grass hover:text-forest"
                  >
                    Reply by email
                  </a>
                </div>
                <SubmissionStatusActions
                  id={message.id}
                  status={message.status}
                  action={setContactStatusAction}
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-[10px] text-muted">
            Showing {items.length} of {total} messages
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/messages?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
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
                href={`/admin/messages?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
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
