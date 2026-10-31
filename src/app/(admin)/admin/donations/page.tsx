import Link from "next/link";
import { Download } from "lucide-react";
import {
  setDonationStatusAction,
  acknowledgeDonationAction,
  deleteDonationAction,
} from "@/app/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminPageHeader,
  AdminSearchForm,
  AdminStat,
  EmptyState,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import { listDonations, listDonationsPaginated } from "@/lib/data/store";
import { cn, formatGhc } from "@/lib/utils";

export const dynamic = "force-dynamic";

const filters = ["all", "pending", "confirmed", "cancelled"] as const;
const PAGE_SIZE = 25;

type PageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
};

export default async function AdminDonationsPage({
  searchParams,
}: PageProps) {
  const { status, search, page } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [{ items, total }, allDonations] = await Promise.all([
    listDonationsPaginated({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search,
      status: active,
    }),
    listDonations(),
  ]);

  const confirmed = allDonations.filter((item) => item.status === "confirmed");
  const pending = allDonations.filter((item) => item.status === "pending");
  const totalRaised = confirmed.reduce((sum, item) => sum + item.amount, 0);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Donations"
        description={
          active === "all"
            ? "Manual donations are saved as pending until the transfer is verified. Confirm a donation only after the funds have been received."
            : `Manual donations with status “${active}”. Confirm a donation only after the funds have been received.`
        }
        action={
          <Link
            href="/admin/donations/export"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-body hover:bg-paper"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Export CSV
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStat
          label="Confirmed total"
          value={formatGhc(totalRaised)}
          note={`${confirmed.length} confirmed donations`}
          tone="green"
        />
        <AdminStat
          label="Pending verification"
          value={pending.length}
          note="Awaiting bank or MoMo confirmation"
          tone="amber"
        />
        <AdminStat
          label="All donations"
          value={allDonations.length}
          note="All time"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <AdminSearchForm
          action="/admin/donations"
          placeholder="Search donor, email, reference…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/donations?search=${search ?? ""}&page=1`
                : `/admin/donations?status=${filter}&search=${search ?? ""}&page=1`
            }
            className={cn(
              "rounded-lg px-3 py-1.5 text-[11.5px] capitalize transition-colors",
              active === filter
                ? "bg-ink font-semibold text-white"
                : "text-muted hover:bg-paper hover:text-ink",
            )}
          >
            {filter}
            {filter !== "all" ? (
              <span className="ml-1.5 text-[9.5px] opacity-60">
                {allDonations.filter((item) => item.status === filter).length}
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No donations in this view"
          description="Donations submitted through the public site will appear here for verification."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line text-[9px] uppercase tracking-[0.12em] text-muted">
                <th className="px-5 py-3 font-medium">Donor</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Method</th>
                <th className="px-3 py-3 font-medium">Reference</th>
                <th className="px-3 py-3 font-medium">Submitted</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((donation) => (
                <tr
                  key={donation.id}
                  className="border-b border-line/70 last:border-0"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/donations/${donation.id}`}
                      className="font-medium text-ink hover:text-grass"
                    >
                      {donation.donorName}
                    </Link>
                    <p className="text-[10px] text-muted">
                      {donation.email}
                    </p>
                    <p className="text-[10px] text-muted">
                      {donation.phone}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="font-semibold text-ink">
                      {formatGhc(donation.amount)}
                    </p>
                    <p className="text-[10px] capitalize text-muted">
                      {donation.frequency}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 capitalize text-muted">
                    {donation.method === "momo"
                      ? "Mobile Money"
                      : "Bank transfer"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[10px] text-body">
                    {donation.reference}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[10px] text-muted">
                    {formatDateTime(donation.createdAt)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={donation.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {!donation.acknowledgedAt && donation.status === "confirmed" ? (
                        <form action={acknowledgeDonationAction}>
                          <input type="hidden" name="id" value={donation.id} />
                          <input type="hidden" name="author" value="Admin" />
                          <button
                            type="submit"
                            className="rounded-md bg-emblem px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-forest-800"
                          >
                            Mark acknowledged
                          </button>
                        </form>
                      ) : donation.acknowledgedAt ? (
                        <span className="text-[10px] text-muted">
                          Acknowledged
                        </span>
                      ) : null}
                      {donation.status !== "confirmed" ? (
                        <form action={setDonationStatusAction}>
                          <input type="hidden" name="id" value={donation.id} />
                          <input type="hidden" name="status" value="confirmed" />
                          <button
                            type="submit"
                            className="rounded-md bg-emblem px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-forest-800"
                          >
                            Confirm
                          </button>
                        </form>
                      ) : (
                        <form action={setDonationStatusAction}>
                          <input type="hidden" name="id" value={donation.id} />
                          <input type="hidden" name="status" value="pending" />
                          <button
                            type="submit"
                            className="rounded-md border border-line px-2.5 py-1 text-[10px] font-medium text-muted hover:bg-paper"
                          >
                            Undo
                          </button>
                        </form>
                      )}
                      {donation.status !== "cancelled" ? (
                        <form action={setDonationStatusAction}>
                          <input type="hidden" name="id" value={donation.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button
                            type="submit"
                            className="rounded-md px-2.5 py-1 text-[10px] font-medium text-coral hover:bg-coral/10"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : null}
                      <DeleteButton
                        action={deleteDonationAction}
                        slug={donation.id}
                        label="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-[10px] text-muted">
            Showing {items.length} of {total} donations
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/donations?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
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
                href={`/admin/donations?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
                className="rounded-lg px-3 py-1.5 border border-line text-[11.5px] hover:bg-paper"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}

      <p className="text-[10.5px] leading-relaxed text-muted">
        Reminder: for monthly pledges, confirmation applies to the first
        transfer. Follow up with the donor to arrange subsequent payments.
      </p>
    </div>
  );
}
