"use client";

import { useActionState, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveStoryAction } from "@/app/admin-actions";
import { Field, Input, Textarea } from "@/components/ui/form";
import { ImageUploadButton } from "@/components/admin/image-upload-button";
import {
  FileText,
  Slash,
  AlertCircle,
  Folder,
  MapPin,
  Calendar,
  Clock,
  Layers,
  Image,
  Eye,
  Quote,
  Edit,
  User,
} from "lucide-react";
import type { Story } from "@/lib/stories";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

function blocksToBody(story?: Story) {
  if (!story) return "";
  return story.blocks
    .map((block) => {
      if (block.type === "h2") return `## ${block.text}`;
      if (block.type === "quote") return `> ${block.text}`;
      return block.text;
    })
    .join("\n\n");
}

export function StoryForm({ story }: { story?: Story }) {
  const [state, action, pending] = useActionState(
    saveStoryAction,
    initialState,
  );
  const [imageValue, setImageValue] = useState(story?.image ?? "");

  return (
    <form action={action} className="space-y-5">
      {story ? (
        <input type="hidden" name="existingSlug" value={story.slug} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" icon={FileText} htmlFor="storyTitle" required className="sm:col-span-2">
          <Input
            id="storyTitle"
            name="title"
            defaultValue={story?.title}
            placeholder="A decade of restored hope"
            required
          />
        </Field>
        <Field
          label="Slug"
          icon={Slash}
          htmlFor="storySlug"
          hint="Leave blank to generate from the title"
        >
          <Input
            id="storySlug"
            name="slug"
            defaultValue={story?.slug}
            placeholder="a-decade-of-restored-hope"
          />
        </Field>
        <Field
          label="Status"
          icon={AlertCircle}
          htmlFor="storyStatus"
          hint="Drafts are hidden from the public site"
        >
          <select
            id="storyStatus"
            name="status"
            defaultValue={story?.status ?? "published"}
            className="block w-full rounded-lg border border-line px-3 py-1.5 text-[11.5px] transition-colors focus:border-ink focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Category" icon={Folder} htmlFor="storyCategory">
          <Input
            id="storyCategory"
            name="category"
            defaultValue={story?.category ?? "Community"}
            placeholder="Community"
          />
        </Field>
        <Field label="Location" icon={MapPin} htmlFor="storyLocation">
          <Input
            id="storyLocation"
            name="location"
            defaultValue={story?.location ?? "Ahafo Region"}
          />
        </Field>
        <Field label="Date" icon={Calendar} htmlFor="storyDate">
          <Input
            id="storyDate"
            name="date"
            type="date"
            defaultValue={story?.date ?? new Date().toLocaleDateString("en-CA")}
          />
        </Field>
        <Field label="Read time" icon={Clock} htmlFor="storyReadTime">
          <Input
            id="storyReadTime"
            name="readTime"
            defaultValue={story?.readTime ?? "3 min read"}
          />
        </Field>
        <Field label="Programmes" icon={Layers} htmlFor="storyProgrammes" hint="Comma separated">
          <Input
            id="storyProgrammes"
            name="programmes"
            defaultValue={story?.programmes.join(", ")}
            placeholder="Food & Relief, Education"
          />
        </Field>
        <Field
          label="Cover image"
          icon={Image}
          hint="Upload a JPEG, PNG, WebP or GIF up to 5MB"
          className="sm:col-span-2"
        >
          <div className="flex items-center gap-3">
            <ImageUploadButton
              value={imageValue}
              onChange={setImageValue}
            />
            <input
              type="hidden"
              name="image"
              value={imageValue}
            />
          </div>
        </Field>
        <Field label="Image alt text" icon={Eye} htmlFor="storyImageAlt">
          <Input
            id="storyImageAlt"
            name="imageAlt"
            defaultValue={story?.imageAlt}
            placeholder="Describe the image for screen readers"
          />
        </Field>
        <Field
          label="Excerpt"
          icon={Quote}
          htmlFor="storyExcerpt"
          className="sm:col-span-2"
        >
          <Textarea
            id="storyExcerpt"
            name="excerpt"
            defaultValue={story?.excerpt}
            className="min-h-20"
            placeholder="One or two sentences shown on story cards."
          />
        </Field>
      </div>

      <div className="border-t border-line pt-5">
        <Field
          label="Story body"
          icon={Edit}
          htmlFor="storyBody"
          hint="Separate paragraphs with a blank line. Start a line with ## for a heading or > for a quote."
        >
          <Textarea
            id="storyBody"
            name="body"
            defaultValue={blocksToBody(story)}
            className="min-h-72 font-mono text-[12px] leading-relaxed"
            placeholder={"In 2016, Mr. Bernard Adu Tutu began visiting widows…\n\n## Four programmes. One mission.\n\n> True community means we are each other's keeper."}
          />
        </Field>
      </div>

      <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
        <Field label="Pull quote" icon={Quote} htmlFor="storyPullQuote">
          <Textarea
            id="storyPullQuote"
            name="pullQuote"
            defaultValue={story?.pullQuote.text}
            className="min-h-20"
          />
        </Field>
        <Field label="Pull quote attribution" icon={User} htmlFor="storyPullQuoteAttribution">
          <Input
            id="storyPullQuoteAttribution"
            name="pullQuoteAttribution"
            defaultValue={story?.pullQuote.attribution}
            placeholder="Community beneficiary — Ahafo Region"
          />
        </Field>
      </div>

      {state.message ? (
        <p className="rounded-lg bg-coral/10 px-3 py-2 text-[12px] font-medium text-coral">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-grass px-5 text-[12.5px] font-semibold text-white hover:bg-moss disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {pending ? "Saving…" : story ? "Save changes" : "Publish story"}
        </button>
      </div>
    </form>
  );
}
