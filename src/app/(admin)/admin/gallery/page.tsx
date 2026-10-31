import Link from "next/link";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { deleteAdminGallery } from "@/lib/data/content";
import {
  AdminCard,
  AdminPageHeader,
  AdminSearchForm,
  EmptyState,
  StatusPill,
} from "@/components/admin/ui";
import {
  listAdminGallery,
  listAdminGalleryPaginated,
} from "@/lib/data/content";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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

export default async function AdminGalleryPage({ searchParams }: PageProps) {
  const { status, search, page } = await searchParams;
  const active = filters.includes(status as (typeof filters)[number])
    ? (status as (typeof filters)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [{ items, total }, allItems] = await Promise.all([
    listAdminGalleryPaginated({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search,
      status: active,
    }),
    listAdminGallery(),
  ]);

  const pageCount = Math.ceil(total / PAGE_SIZE);
  const hasFilters = Boolean(search) || active !== "all";

  async function handleDelete(formData: FormData) {
    "use server";
    const { requireAdmin } = await import("@/lib/auth");
    const { logAdminAction } = await import("@/lib/audit");
    const session = await requireAdmin();
    const id = formData.get("id") as string;
    if (id) {
      await deleteAdminGallery(id);
      await logAdminAction({
        actor: session.email,
        action: "delete",
        entityType: "gallery",
        entityId: id,
      });
    }
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description="Manage photos shown on the public Gallery page."
        action={
          <Link
            href="/admin/gallery/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emblem px-4 text-[12px] font-semibold text-white hover:bg-forest-800"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New image
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <AdminSearchForm
          action="/admin/gallery"
          placeholder="Search title, slug, category…"
          defaultValue={search}
          hidden={{ status: active }}
        />
        {filters.map((filter) => (
          <Link
            key={filter}
            href={
              filter === "all"
                ? `/admin/gallery?search=${search ?? ""}&page=1`
                : `/admin/gallery?status=${filter}&search=${search ?? ""}&page=1`
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
                ? allItems.length
                : allItems.filter((item) => item.status === filter).length}
            </span>
          </Link>
        ))}
        {hasFilters ? (
          <Link
            href="/admin/gallery"
            className="text-[11px] font-medium text-grass hover:text-forest"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      <AdminCard>
        {items.length === 0 ? (
          <EmptyState
            title="No gallery items in this view"
            description="Images uploaded through the admin console will appear here."
            action={
              hasFilters ? (
                <Link
                  href="/admin/gallery"
                  className="text-[11px] font-semibold text-grass"
                >
                  Clear filters
                </Link>
              ) : (
                <Link
                  href="/admin/gallery/new"
                  className="text-[11px] font-semibold text-grass"
                >
                  Add an image
                </Link>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.slug}
                className="group relative overflow-hidden rounded-lg border border-line bg-paper"
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${item.image.replace(/"/g, "%22")}")`,
                  }}
                />
                <div className="p-3">
                  <p className="truncate text-[11.5px] font-medium text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-muted">
                    {item.category || "Uncategorised"} · {item.status}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1 border-t border-line px-3 py-2">
                  <Link
                    href={`/admin/gallery/${item.slug}`}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-grass hover:bg-mint"
                  >
                    Edit
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={item.slug} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-coral hover:bg-coral/10"
                    >
                      <Trash2 className="size-3" aria-hidden="true" />
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-[10px] text-muted">
            Showing {items.length} of {total} items
          </p>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/admin/gallery?status=${active}&search=${search ?? ""}&page=${currentPage - 1}`}
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
                href={`/admin/gallery?status=${active}&search=${search ?? ""}&page=${currentPage + 1}`}
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