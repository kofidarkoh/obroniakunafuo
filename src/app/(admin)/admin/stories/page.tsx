import Link from "next/link";
import { CheckCircle2, Eye, Pencil, Plus } from "lucide-react";
import { deleteStoryAction } from "@/app/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminCard,
  AdminPageHeader,
  AdminSearchForm,
  EmptyState,
} from "@/components/admin/ui";
import {
  listAdminStories,
  listAdminStoriesPaginated,
} from "@/lib/data/content";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const filters = ["all", "draft", "published"] as const;
const PAGE_SIZE = 25;

type PageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
    saved?: string;
  }>;
};

export default async function AdminStoriesPage({ searchParams }: PageProps) {
  const { status, search, page, saved } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [{ items, total }, allStories] = await Promise.all([
    listAdminStoriesPaginated({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search,
      status: active,
    }),
    listAdminStories(),
  ]);

  const pageCount = Math.ceil(total / PAGE_SIZE);
  const hasFilters = Boolean(search) || active !== "all";

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
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emblem px-4 text-[12px] font-semibold text-white hover:bg-forest-800"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New story
          </Link>
        }
      />

      {saved ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-moss/20 bg-mint px-4 py-3 text-[12px] font-medium text-moss"
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Story saved.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <AdminSearchForm
          action="/admin/stories"
          placeholder="Search title, slug, category…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/stories?search=${search ?? ""}&page=1`
                : `/admin/stories?status=${filter}&search=${search ?? ""}&page=1`
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
                ? allStories.length
                : allStories.filter((item) => item.status === filter).length}
            </span>
          </Link>
        ))}
        {hasFilters ? (
          <Link
            href="/admin/stories"
            className="text-[11px] font-medium text-grass hover:text-forest"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      <AdminCard>
        {items.length === 0 ? (
          <EmptyState
            title="No stories in this view"
            description="Stories submitted through the admin console will appear here."
            action={
              hasFilters ? (
                <Link
                  href="/admin/stories"
                  className="text-[11px] font-semibold text-grass"
                >
                  Clear filters
                </Link>
              ) : (
                <Link
                  href="/admin/stories/new"
                  className="text-[11px] font-semibold text-grass"
                >
                  Create a story
                </Link>
              )
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
                {items.map((story) => (
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
                          story.status === "published"
                            ? "bg-mint text-moss"
                            : "bg-paper text-muted",
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

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-[10px] text-muted">
            Showing {items.length} of {total} stories
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/stories?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
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
                href={`/admin/stories?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
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