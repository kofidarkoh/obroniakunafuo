import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminGallery } from "@/lib/data/content";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { GalleryForm } from "@/app/(admin)/admin/gallery/new/page";

export const dynamic = "force-dynamic";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAdminGallery(slug);

  if (!item) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit gallery image" description="This item no longer exists." />
        <AdminCard className="p-5 sm:p-6">
          <p className="text-[12px] text-muted">The gallery item you are looking for could not be found.</p>
          <Link
            href="/admin/gallery"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to gallery
          </Link>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update the gallery image details."
        action={
          <Link
            href="/admin/gallery"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to gallery
          </Link>
        }
      />
      <AdminCard className="p-5 sm:p-6">
        <GalleryForm
          existingSlug={item.slug}
          item={{
            slug: item.slug,
            title: item.title,
            image: item.image,
            imageAlt: item.imageAlt,
            caption: item.caption,
            category: item.category,
            status: item.status,
          }}
        />
      </AdminCard>
    </div>
  );
}