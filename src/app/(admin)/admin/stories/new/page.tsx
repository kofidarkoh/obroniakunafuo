import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StoryForm } from "@/components/admin/story-form";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default function NewStoryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New story"
        description="Write and publish a story for the public site."
        action={
          <Link
            href="/admin/stories"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to stories
          </Link>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <StoryForm />
      </AdminCard>
    </div>
  );
}
