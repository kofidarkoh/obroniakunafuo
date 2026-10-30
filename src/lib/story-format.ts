import type { Story, StoryBlock } from "@/lib/stories";

const defaultCategories = [
  "Community",
  "Success story",
  "Education",
  "Health",
  "PWD inclusion",
] as const;

/** Parse the editor's plain-text body into public story blocks. */
export function parseStoryBlocks(body: string): StoryBlock[] {
  return body
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("## ")) {
        return { type: "h2", text: chunk.slice(3).trim() } as StoryBlock;
      }
      if (chunk.startsWith("> ")) {
        return { type: "quote", text: chunk.slice(2).trim() } as StoryBlock;
      }
      return { type: "p", text: chunk.replace(/\n/g, " ") } as StoryBlock;
    });
}

export function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
}

/** The public read time is derived from the story body, never hand-typed. */
export function estimateReadTime(body: string) {
  return `${Math.max(1, Math.ceil(countWords(body) / 200))} min read`;
}

/** Turn an existing story back into editable body text. */
export function blocksToBody(story?: Story) {
  if (!story) return "";
  return story.blocks
    .map((block) => {
      if (block.type === "h2") return `## ${block.text}`;
      if (block.type === "quote") return `> ${block.text}`;
      return block.text;
    })
    .join("\n\n");
}

export function storyCategoryOptions(stories: Story[]) {
  return Array.from(
    new Set([...defaultCategories, ...stories.map((story) => story.category)]),
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
