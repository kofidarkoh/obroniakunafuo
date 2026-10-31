import { listGallery } from "@/lib/data/content";
import { GalleryGrid } from "@/components/site/gallery-grid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await listGallery();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">Gallery</h1>
      <p className="mt-2 text-body">
        Photos from our programmes, events and community outreach.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 text-[12px] text-muted">
          No photos published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10">
          <GalleryGrid items={items} />
        </div>
      )}
    </div>
  );
}