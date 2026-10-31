import Link from "next/link";
import { setVolunteerStatusAction, deleteVolunteerAction } from "@/app/admin-actions";
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
import { listVolunteersPaginated } from "@/lib/data/store";
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

export default async function AdminVolunteersPage({
  searchParams,
}: PageProps) {
  const { status, search, page } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const { items, total, counts } = await listVolunteersPaginated({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search,
    status: active,
  });

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Volunteers"
        description={
          active === "all"
            ? "Applications submitted through the volunteer form. Review each application and contact the applicant within 3–5 working days."
            : `Volunteer applications with status “${active}”. Review each application and contact the applicant within 3–5 working days.`
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStat label="All applications" value={counts.all ?? 0} />
        <AdminStat
          label="Awaiting review"
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
          action="/admin/volunteers"
          placeholder="Search name, email, location…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/volunteers?search=${search ?? ""}&page=1`
                : `/admin/volunteers?status=${filter}&search=${search ?? ""}&page=1`
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
            title="No volunteer applications in this view"
            description="Applications submitted through the volunteer form will appear here."
          />
        </AdminCard>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {items.map((application) => (
            <AdminCard key={application.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/volunteers/${application.id}`}
                      className="text-[13px] font-semibold text-ink hover:text-grass"
                    >
                      {application.name}
                    </Link>
                    <StatusPill status={application.status} />
                  </div>
                  <p className="mt-1 text-[10.5px] text-muted">
                    {application.email} · {application.phone}
                  </p>
                  <p className="text-[10.5px] text-muted">
                    {application.location}
                  </p>
                </div>
                <p className="shrink-0 text-[9.5px] text-muted">
                  {formatDateTime(application.createdAt)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {application.interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="rounded-full bg-mint px-2 py-0.5 text-[9.5px] font-medium text-moss"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-[10.5px] text-muted">
                <span className="font-medium text-body">Availability:</span>{" "}
                {application.availability} · {application.involvement}
              </p>

              {application.skills ? (
                <p className="mt-2 text-[10.5px] text-muted">
                  <span className="font-medium text-body">Skills:</span>{" "}
                  {application.skills}
                </p>
              ) : null}

              <p className="mt-3 flex-1 rounded-lg bg-paper px-4 py-3 text-[11.5px] leading-relaxed text-body">
                {application.motivation}
              </p>

              {application.experience ? (
                <p className="mt-2 text-[10px] leading-relaxed text-muted">
                  <span className="font-medium text-body">Experience:</span>{" "}
                  {application.experience}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/volunteers/${application.id}`}
                    className="text-[10.5px] font-semibold text-ink hover:text-grass"
                  >
                    View details
                  </Link>
                  <a
                    href={`mailto:${application.email}?subject=${encodeURIComponent("Your volunteer application — Obroni Akunafo Kuo")}`}
                    className="text-[10.5px] font-semibold text-grass hover:text-forest"
                  >
                    Contact applicant
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <SubmissionStatusActions
                    id={application.id}
                    status={application.status}
                    action={setVolunteerStatusAction}
                  />
                  <DeleteButton
                    action={deleteVolunteerAction}
                    slug={application.id}
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
            Showing {items.length} of {total} applications
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/volunteers?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
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
                href={`/admin/volunteers?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
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
