import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { deleteProgrammeAction } from "@/app/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
} from "@/components/admin/ui";
import { listAdminProgrammes } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const accentStyles = {
  green: "bg-mint text-moss",
  orange: "bg-amber/10 text-amber",
  blue: "bg-blue/10 text-blue",
  purple: "bg-purple-bright/10 text-purple-bright",
} as const;

export default async function AdminProgrammesPage() {
  const programmes = await listAdminProgrammes();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Programmes"
        description="Edit programme copy and control where each programme appears."
        action={
          <Link
            href="/admin/programmes/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-grass px-4 text-[12px] font-semibold text-white hover:bg-moss"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New programme
          </Link>
        }
      />

      <AdminCard>
        {programmes.length === 0 ? (
          <EmptyState
            title="No programmes yet"
            description="Add your first programme to show it on the public site."
            action={
              <Link
                href="/admin/programmes/new"
                className="text-[11px] font-semibold text-grass"
              >
                Add a programme
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[11.5px]">
              <thead>
                <tr className="border-b border-line text-[9px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-3 font-medium">Programme</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Homepage</th>
                  <th className="px-3 py-3 font-medium">Programmes page</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programmes.map((programme) => (
                  <tr
                    key={programme.slug}
                    className="border-b border-line/70 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold uppercase",
                            accentStyles[programme.accent] ?? accentStyles.green,
                          )}
                        >
                          {programme.shortTitle.slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-medium text-ink">{programme.title}</p>
                          <p className="text-[10px] text-muted">
                            /{programme.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted">
                      {programme.category}
                    </td>
                    <td className="px-3 py-3">
                      <Badge on={programme.featuredOnHome} />
                    </td>
                    <td className="px-3 py-3">
                      <Badge on={programme.showOnProgrammes} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/programmes/${programme.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted hover:bg-paper hover:text-ink"
                        >
                          <Eye className="size-3" aria-hidden="true" />
                          View
                        </Link>
                        <Link
                          href={`/admin/programmes/${programme.slug}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-grass hover:bg-mint"
                        >
                          <Pencil className="size-3" aria-hidden="true" />
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteProgrammeAction}
                          slug={programme.slug}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

function Badge({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium",
        on ? "bg-mint text-moss" : "bg-paper text-muted",
      )}
    >
      {on ? "Visible" : "Hidden"}
    </span>
  );
}
