import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import {
  setPartnershipStatusAction,
  addNoteFormAction,
} from "@/app/admin-actions";
import { SubmissionStatusActions } from "@/components/admin/status-actions";
import {
  AdminCard,
  AdminPageHeader,
  StatusPill,
  formatDateTime,
} from "@/components/admin/ui";
import { getPartnership, listNotes } from "@/lib/data/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function PartnershipDetailPage({ params }: PageProps) {
  const { id } = await params;
  const partnership = await getPartnership(id);

  if (!partnership) notFound();

  const notes =
    partnership.notes && partnership.notes.length
      ? partnership.notes
      : await listNotes("partnerships", id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Partnership detail"
        description={`Enquiry from ${partnership.organisation}. Respond within 3–5 working days and record the outcome.`}
        action={
          <Link
            href="/admin/partnerships"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeftIcon />
            Back to partnerships
          </Link>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-purple-deep/10 text-purple-deep">
                <Building2 className="size-3.5" aria-hidden="true" />
              </span>
              <p className="text-[13px] font-semibold text-ink">
                {partnership.organisation}
              </p>
              <StatusPill status={partnership.status} />
            </div>
            <p className="mt-1.5 text-[10.5px] text-muted">
              {partnership.contactName} · {partnership.email} · {partnership.phone}
            </p>
          </div>
          <p className="shrink-0 text-[9.5px] text-muted">
            {formatDateTime(partnership.createdAt)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-mint px-2 py-0.5 text-[9.5px] font-medium text-moss">
            {partnership.area}
          </span>
          <span className="rounded-full bg-paper px-2 py-0.5 text-[9.5px] font-medium text-body">
            {partnership.supportType}
          </span>
        </div>

        <p className="mt-3 flex-1 rounded-lg bg-paper px-4 py-3 text-[11.5px] leading-relaxed text-body">
          {partnership.message}
        </p>

        <p className="mt-2 text-[10px] text-muted">
          Preferred: {partnership.meetingFormat} · via {partnership.contactMethod}
        </p>

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            Internal notes
          </h2>

          <form action={addNoteFormAction} className="mt-4 space-y-3">
            <input type="hidden" name="collection" value="partnerships" />
            <input type="hidden" name="id" value={partnership.id} />
            <input type="hidden" name="author" value="Admin" />
            <div className="grid gap-2 sm:grid-cols-2">
              <TextareaField
                id="noteText"
                name="note"
                placeholder="Add an internal note…"
                className="sm:col-span-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-emblem px-4 py-2.5 text-[11.5px] font-semibold text-white hover:bg-forest-800"
              >
                Add note
              </button>
            </div>
          </form>

          {notes.length === 0 ? (
            <p className="mt-3 text-[11px] text-muted">
              No internal notes yet.
            </p>
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
            href={`mailto:${partnership.email}?subject=${encodeURIComponent("Your partnership enquiry — Obroni Akunafo Kuo")}`}
            className="text-[10.5px] font-semibold text-grass hover:text-forest"
          >
            Reply by email
          </a>
          <SubmissionStatusActions
            id={partnership.id}
            status={partnership.status}
            action={setPartnershipStatusAction}
          />
        </div>
      </AdminCard>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      className="size-3.5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function TextareaField({
  id,
  name,
  placeholder,
  className,
}: {
  id: string;
  name: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      className={cn(
        "block w-full rounded-lg border border-line px-3 py-1.5 text-[11.5px] transition-colors focus:border-ink focus:outline-none min-h-[80px]",
        className,
      )}
    />
  );
}
