import Link from "next/link";
import { Building2 } from "lucide-react";
import { setPartnershipStatusAction, deletePartnershipAction } from "@/app/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
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
import { listPartnershipsPaginated } from "@/lib/data/store";
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

export default async function AdminPartnershipsPage({
  searchParams,
}: PageProps) {
  const { status, search, page } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const { items, total, counts } = await listPartnershipsPaginated({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search,
    status: active,
  });

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Partnerships"
        description={
          active === "all"
            ? "Corporate and organisational enquiries. Respond within 3–5 working days and record the outcome."
            : `Partnership enquiries with status “${active}”. Respond within 3–5 working days and record the outcome.`
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStat label="All enquiries" value={counts.all ?? 0} />
        <AdminStat
          label="Under review"
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
          action="/admin/partnerships"
          placeholder="Search organisation, contact, message…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/partnerships?search=${search ?? ""}&page=1`
                : `/admin/partnerships?status=${filter}&search=${search ?? ""}&page=1`
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
            title="No partnership enquiries in this view"
            description="Enquiries submitted through the partner page will appear here."
          />
        </AdminCard>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {items.map((enquiry) => (
            <AdminCard key={enquiry.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-md bg-purple-deep/10 text-purple-deep">
                      <Building2 className="size-3.5" aria-hidden="true" />
                    </span>
                    <Link
                      href={`/admin/partnerships/${enquiry.id}`}
                      className="text-[13px] font-semibold text-ink hover:text-grass"
                    >
                      {enquiry.organisation}
                    </Link>
                    <StatusPill status={enquiry.status} />
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-muted">
                    {enquiry.contactName} · {enquiry.email} · {enquiry.phone}
                  </p>
                </div>
                <p className="shrink-0 text-[9.5px] text-muted">
                  {formatDateTime(enquiry.createdAt)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-mint px-2 py-0.5 text-[9.5px] font-medium text-moss">
                  {enquiry.area}
                </span>
                <span className="rounded-full bg-paper px-2 py-0.5 text-[9.5px] font-medium text-body">
                  {enquiry.supportType}
                </span>
              </div>

              <p className="mt-3 flex-1 rounded-lg bg-paper px-4 py-3 text-[11.5px] leading-relaxed text-body">
                {enquiry.message}
              </p>

              <p className="mt-2 text-[10px] text-muted">
                Preferred: {enquiry.meetingFormat} · via {enquiry.contactMethod}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/partnerships/${enquiry.id}`}
                    className="text-[10.5px] font-semibold text-ink hover:text-grass"
                  >
                    View details
                  </Link>
                  <a
                    href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Your partnership enquiry — Obroni Akunafo Kuo")}`}
                    className="text-[10.5px] font-semibold text-grass hover:text-forest"
                  >
                    Reply by email
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <SubmissionStatusActions
                    id={enquiry.id}
                    status={enquiry.status}
                    action={setPartnershipStatusAction}
                  />
                  <DeleteButton
                    action={deletePartnershipAction}
                    slug={enquiry.id}
                    label="Delete"
                  />
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-[10px] text-muted">
            Showing {items.length} of {total} enquiries
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/partnerships?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
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
                href={`/admin/partnerships?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
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
