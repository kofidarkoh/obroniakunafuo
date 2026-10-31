import Link from "next/link";
import {
  ArrowRight,
  FileText,
  HeartHandshake,
  MessageSquare,
  Users,
} from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  AdminStat,
  EmptyState,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import {
  listContacts,
  listDonations,
  listPartnerships,
  listVolunteers,
} from "@/lib/data/store";
import { listAdminStories } from "@/lib/data/content";
import { cn, formatGhc } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [donations, contacts, volunteers, partnerships, stories] =
    await Promise.all([
      listDonations(),
      listContacts(),
      listVolunteers(),
      listPartnerships(),
      listAdminStories(),
    ]);

  const confirmed = donations.filter((item) => item.status === "confirmed");
  const pending = donations.filter((item) => item.status === "pending");
  const raised = confirmed.reduce((sum, item) => sum + item.amount, 0);
  const openEnquiries =
    contacts.filter((item) => item.status === "new").length +
    partnerships.filter((item) => item.status === "new").length;

  // Monthly pledge: confirmed monthly donations
  const monthlyConfirmed = confirmed.filter(
    (item) => item.frequency === "monthly",
  );
  const monthlyTotal = monthlyConfirmed.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  // Donations over time: last 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const dailyConfirmed = last7Days.map((day) => {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    return confirmed.filter(
      (item) =>
        new Date(item.createdAt) >= start && new Date(item.createdAt) <= end,
    ).length;
  });

  const maxDaily = Math.max(...dailyConfirmed, 1);

  const recent = [
    ...donations.map((item) => ({
      id: item.id,
      type: "Donation",
      name: item.donorName,
      detail: formatGhc(item.amount),
      status: item.status,
      createdAt: item.createdAt,
      href: "/admin/donations",
    })),
    ...contacts.map((item) => ({
      id: item.id,
      type: "Message",
      name: item.name,
      detail: item.reason,
      status: item.status,
      createdAt: item.createdAt,
      href: "/admin/messages",
    })),
    ...volunteers.map((item) => ({
      id: item.id,
      type: "Volunteer",
      name: item.name,
      detail: item.interests.slice(0, 2).join(", "),
      status: item.status,
      createdAt: item.createdAt,
      href: "/admin/volunteers",
    })),
    ...partnerships.map((item) => ({
      id: item.id,
      type: "Partnership",
      name: item.organisation,
      detail: item.area,
      status: item.status,
      createdAt: item.createdAt,
      href: "/admin/partnerships",
    })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="An overview of donations, enquiries and content across the Obroni Akunafo Kuo website."
        action={
          <Link
            href="/admin/donations"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-4 text-[12px] font-medium text-white hover:bg-ink-900"
          >
            Review donations
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStat
          label="Confirmed donations"
          value={formatGhc(raised)}
          note={`${confirmed.length} confirmed · ${pending.length} pending`}
          icon={<HeartHandshake className="size-4" />}
          tone="green"
          href="/admin/donations"
        />
        <AdminStat
          label="Open enquiries"
          value={openEnquiries}
          note={`${contacts.length} messages · ${partnerships.length} partnerships`}
          icon={<MessageSquare className="size-4" />}
          tone="amber"
          href="/admin/messages"
        />
        <AdminStat
          label="Volunteer applications"
          value={volunteers.length}
          note={`${volunteers.filter((item) => item.status === "new").length} awaiting review`}
          icon={<Users className="size-4" />}
          tone="purple"
          href="/admin/volunteers"
        />
        <AdminStat
          label="Published stories"
          value={stories.length}
          note="Manage news and impact stories"
          icon={<FileText className="size-4" />}
          href="/admin/stories"
        />
        <AdminStat
          label="Monthly pledges"
          value={formatGhc(monthlyTotal)}
          note={`${monthlyConfirmed.length} confirmed monthly donors`}
          tone="green"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <AdminCard>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-[13px] font-semibold text-ink">
              Donations over time (7 days)
            </h3>
            <span className="text-[10px] text-muted">
              Confirmed donations per day
            </span>
          </div>
          <div className="px-5 pb-4">
            <div className="flex items-end gap-1 h-32">
              {dailyConfirmed.map((count, i) => {
                const height = Math.max((count / maxDaily) * 100, 8);
                const dayLabel = last7Days[i]
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })
                  .replace(" ", " ");
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 w-full"
                  >
                    <div
                      className={cn(
                        "w-full bg-mint rounded-t-[6px] transition-colors",
                        count > 0 && "hover:bg-forest-800",
                      )}
                      style={{ height: `${height}%` }}
                      title={`${dayLabel}: ${count} donation${count !== 1 ? "s" : ""}`}
                    />
                    <span
                      className="text-[9px] text-muted truncate w-12"
                      title={dayLabel}
                    >
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="text-[13px] font-semibold text-ink">
                Pending donations
              </h3>
              <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[9.5px] font-semibold text-amber">
                {pending.length}
              </span>
            </div>
            {pending.length === 0 ? (
              <EmptyState
                title="All caught up"
                description="There are no donations awaiting confirmation."
              />
            ) : (
              <ul className="divide-y divide-line">
                {pending.slice(0, 5).map((donation) => (
                  <li
                    key={donation.id}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium text-ink">
                        {donation.donorName}
                      </p>
                      <p className="text-[9.5px] text-muted">
                        {donation.reference} ·{" "}
                        {formatDateTime(donation.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11.5px] font-semibold text-ink">
                        {formatGhc(donation.amount)}
                      </p>
                      <Link
                        href="/admin/donations"
                        className="text-[9.5px] font-medium text-grass hover:text-forest"
                      >
                        Review
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          <AdminCard className="bg-forest p-5 text-white">
            <p className="eyebrow text-grass">Quick actions</p>
            <div className="mt-4 grid gap-2">
              {[
                { href: "/admin/stories/new", label: "Write a new story" },
                { href: "/admin/programmes", label: "Update programmes" },
                { href: "/admin/settings", label: "Edit organisation details" },
                 { href: "/admin/export", label: "Download full backup (JSON)" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-[11.5px] text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminCard className="col-span-3">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-[13px] font-semibold text-ink">
              Recent submissions
            </h3>
            <span className="text-[10px] text-muted">
              {recent.length} shown
            </span>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="No submissions yet"
              description="Donations, messages, volunteer applications and partnership enquiries will appear here as they arrive."
            />
          ) : (
            <div className="overflow-x-auto px-5 pb-4">
              <table className="w-full text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-line text-[9px] uppercase tracking-[0.12em] text-muted">
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Detail</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((item) => (
                    <tr
                      key={`${item.type}-${item.id}`}
                      className="border-b border-line/70 last:border-0"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-muted">
                        {item.type}
                      </td>
                      <td className="px-3 py-3 font-medium text-ink">
                        {item.name}
                      </td>
                      <td className="max-w-[220px] truncate px-3 py-3 text-muted">
                        {item.detail}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[10px] text-muted">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={item.href}>
                          <StatusPill status={item.status} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
