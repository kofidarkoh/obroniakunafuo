import { StoryForm } from "@/components/admin/story-form";
import {
  listAdminProgrammes,
  listAdminStories,
} from "@/lib/data/content";
import { storyCategoryOptions } from "@/lib/story-format";

export const dynamic = "force-dynamic";

export default async function NewStoryPage() {
  const [programmes, stories] = await Promise.all([
    listAdminProgrammes(),
    listAdminStories(),
  ]);

  return (
    <StoryForm
      programmeOptions={programmes.map((programme) => programme.title)}
      categoryOptions={storyCategoryOptions(stories)}
    />
  );
}
