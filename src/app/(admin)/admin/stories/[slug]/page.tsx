import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { StoryForm } from "@/components/admin/story-form";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { getAdminStory } from "@/lib/data/content";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getAdminStory(slug);

  if (!story) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit story"
        description={`Editing “${story.title}”.`}
        action={
          <div className="flex items-center gap-2">
            {story.status === "published" ? (
              <Link
                href={`/stories/${story.slug}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                View live
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center rounded-lg border border-line bg-paper px-4 text-[12px] font-medium text-muted">
                Draft — not public
              </span>
            )}
            <Link
              href="/admin/stories"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back
            </Link>
          </div>
        }
      />


      <AdminCard className="p-5 sm:p-6">
        <StoryForm story={story} />
      </AdminCard>
    </div>
  );
}
