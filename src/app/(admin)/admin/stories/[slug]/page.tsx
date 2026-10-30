import { notFound } from "next/navigation";
import { StoryForm } from "@/components/admin/story-form";
import {
  getAdminStory,
  listAdminProgrammes,
  listAdminStories,
} from "@/lib/data/content";
import { storyCategoryOptions } from "@/lib/story-format";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ slug }, { saved }] = await Promise.all([params, searchParams]);
  const [story, programmes, stories] = await Promise.all([
    getAdminStory(slug),
    listAdminProgrammes(),
    listAdminStories(),
  ]);

  if (!story) notFound();

  return (
    <StoryForm
      story={story}
      saved={Boolean(saved)}
      programmeOptions={programmes.map((programme) => programme.title)}
      categoryOptions={storyCategoryOptions(stories)}
    />
  );
}
