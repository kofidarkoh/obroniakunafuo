import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { deleteStoryAction } from "@/app/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
} from "@/components/admin/ui";
import { listAdminStories } from "@/lib/data/content";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  draft: "bg-paper text-muted",
  published: "bg-mint text-moss",
};

export default async function AdminStoriesPage() {
  const stories = await listAdminStories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Stories"
        description={
          "Manage the stories shown on the public Stories page and homepage. Drafts are hidden from visitors until published."
        }
        action={
          <Link
            href="/admin/stories/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-grass px-4 text-[12px] font-semibold text-white hover:bg-moss"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New story
          </Link>
        }
      />

      <AdminCard>
        {stories.length === 0 ? (
          <EmptyState
            title="No stories yet"
            description="Create your first story to share impact with supporters."
            action={
              <Link
                href="/admin/stories/new"
                className="text-[11px] font-semibold text-grass"
              >
                Create a story
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[11.5px]">
              <thead>
                <tr className="border-b border-line text-[9px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-3 font-medium">Story</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Read time</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr
                    key={story.slug}
                    className="border-b border-line/70 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <p className="max-w-[360px] font-medium text-ink">
                        {story.title}
                      </p>
                      <p className="mt-0.5 max-w-[420px] truncate text-[10px] text-muted">
                        /{story.slug}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted">
                      {story.category}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-semibold capitalize",
                          statusStyles[story.status] ?? "bg-paper text-muted",
                        )}
                      >
                        <span className="size-1 rounded-full bg-current" />
                        {story.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[10px] text-muted">
                      {formatDate(story.date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[10px] text-muted">
                      {story.readTime}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {story.status === "published" ? (
                          <Link
                            href={`/stories/${story.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted hover:bg-paper hover:text-ink"
                          >
                            <Eye className="size-3" aria-hidden="true" />
                            View
                          </Link>
                        ) : null}
                        <Link
                          href={`/admin/stories/${story.slug}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-grass hover:bg-mint"
                        >
                          <Pencil className="size-3" aria-hidden="true" />
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteStoryAction}
                          slug={story.slug}
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
