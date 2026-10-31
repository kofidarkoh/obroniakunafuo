import Link from "next/link";
import { notFound } from "next/navigation";
import {
  setDonationStatusAction,
  acknowledgeDonationAction,
  addNoteFormAction,
  deleteDonationAction,
} from "@/app/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminCard,
  AdminPageHeader,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import { getDonation, listNotes } from "@/lib/data/store";
import { formatGhc } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function DonationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const donation = await getDonation(id);

  if (!donation) notFound();

  const notes =
    donation.notes && donation.notes.length
      ? donation.notes
      : await listNotes("donations", id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Donation detail"
        description={`Donation from ${donation.donorName} — ${formatGhc(donation.amount)}.`}
        action={
          <Link
            href="/admin/donations"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            Back to donations
          </Link>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-semibold text-ink">
                {donation.donorName}
              </p>
              <StatusPill status={donation.status} />
            </div>
            <p className="mt-1 text-[10.5px] text-muted">
              {donation.email} · {donation.phone}
            </p>
            <p className="text-[10.5px] text-muted">
              {donation.method === "momo" ? "Mobile Money" : "Bank transfer"} ·{" "}
              {donation.frequency}
            </p>
          </div>
          <p className="shrink-0 text-[9.5px] text-muted">
            {formatDateTime(donation.createdAt)}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-paper px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted">
              Amount
            </p>
            <p className="mt-1 text-[16px] font-semibold text-ink">
              {formatGhc(donation.amount)}
            </p>
          </div>
          <div className="rounded-lg bg-paper px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted">
              Reference
            </p>
            <p className="mt-1 font-mono text-[11px] text-body">
              {donation.reference}
            </p>
          </div>
        </div>

        {donation.message ? (
          <p className="mt-3 flex-1 rounded-lg bg-paper px-4 py-3 text-[11.5px] leading-relaxed text-body">
            {donation.message}
          </p>
        ) : null}

        {donation.status === "confirmed" && donation.acknowledgedAt ? (
          <p className="mt-3 text-[10px] text-muted">
            Acknowledged by {donation.acknowledgedBy} on{" "}
            {formatDateTime(donation.acknowledgedAt)}
          </p>
        ) : null}

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            Internal notes
          </h2>

          <form action={addNoteFormAction} className="mt-4 space-y-3">
            <input type="hidden" name="collection" value="donations" />
            <input type="hidden" name="id" value={donation.id} />
            <input type="hidden" name="author" value="Admin" />
            <textarea
              id="noteText"
              name="note"
              placeholder="Add an internal note…"
              className="block w-full rounded-lg border border-line px-3 py-1.5 text-[11.5px] transition-colors focus:border-ink focus:outline-none min-h-[80px]"
            />
            <button
              type="submit"
              className="rounded-lg bg-emblem px-4 py-2.5 text-[11.5px] font-semibold text-white hover:bg-forest-800"
            >
              Add note
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="mt-3 text-[11px] text-muted">No internal notes yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-line bg-paper p-3 text-[11px] leading-relaxed"
                >
                  <p className="text-body">{note.text}</p>
                  <p className="mt-1 text-[9px] text-muted">
                    {note.author} · {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <a
            href={`mailto:${donation.email}?subject=${encodeURIComponent("Your donation — Obroni Akunafo Kuo")}`}
            className="text-[10.5px] font-semibold text-grass hover:text-forest"
          >
            Contact donor
          </a>
          <div className="flex items-center gap-2">
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
            ) : null}
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
            ) : null}
            <DeleteButton
              action={deleteDonationAction}
              slug={donation.id}
              label="Delete"
            />
          </div>
        </div>
      </AdminCard>
    </div>
  );
}