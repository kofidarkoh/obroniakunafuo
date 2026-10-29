"use client";

import { useActionState, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveProgrammeAction } from "@/app/admin-actions";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageUploadButton } from "@/components/admin/image-upload-button";
import {
  FileText,
  Slash,
  Folder,
  Palette,
  Image,
  List,
  ArrowRight,
  Eye,
} from "lucide-react";
import type { Programme } from "@/lib/site";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

const accents = [
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
] as const;

const icons = [
  { value: "utensils", label: "Utensils" },
  { value: "graduation", label: "Graduation cap" },
  { value: "heart-pulse", label: "Heart pulse" },
  { value: "home", label: "Home" },
  { value: "hand-heart", label: "Hand heart" },
] as const;

export function ProgrammeForm({ programme }: { programme: Programme }) {
  const [state, action, pending] = useActionState(
    saveProgrammeAction,
    initialState,
  );
  const [imageValue, setImageValue] = useState(programme.image);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="existingSlug" value={programme.slug} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" icon={FileText} htmlFor="programmeTitle" required>
          <Input
            id="programmeTitle"
            name="title"
            defaultValue={programme.title}
            required
          />
        </Field>
        <Field label="Short title" icon={FileText} htmlFor="programmeShortTitle">
          <Input
            id="programmeShortTitle"
            name="shortTitle"
            defaultValue={programme.shortTitle}
          />
        </Field>
        <Field
          label="Slug"
          icon={Slash}
          htmlFor="programmeSlug"
          hint="Leave blank to generate from the title"
        >
          <Input
            id="programmeSlug"
            name="slug"
            defaultValue={programme.slug}
            placeholder="food-support-relief"
          />
        </Field>
        <Field label="Category" icon={Folder} htmlFor="programmeCategory">
          <Input
            id="programmeCategory"
            name="category"
            defaultValue={programme.category}
          />
        </Field>
        <Field label="Accent colour" icon={Palette} htmlFor="programmeAccent">
          <Select
            id="programmeAccent"
            name="accent"
            defaultValue={programme.accent}
          >
            {accents.map((accent) => (
              <option key={accent.value} value={accent.value}>
                {accent.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Icon" icon={Image} htmlFor="programmeIcon">
          <Select id="programmeIcon" name="icon" defaultValue={programme.icon}>
            {icons.map((icon) => (
              <option key={icon.value} value={icon.value}>
                {icon.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Summary"
          icon={FileText}
          htmlFor="programmeSummary"
          className="sm:col-span-2"
        >
          <Textarea
            id="programmeSummary"
            name="summary"
            defaultValue={programme.summary}
            className="min-h-20"
          />
        </Field>
        <Field
          label="Description"
          icon={FileText}
          htmlFor="programmeDescription"
          className="sm:col-span-2"
        >
          <Textarea
            id="programmeDescription"
            name="description"
            defaultValue={programme.description}
            className="min-h-32"
          />
        </Field>
        <Field
          label="Bullet points"
          icon={List}
          htmlFor="programmeBullets"
          hint="One per line"
          className="sm:col-span-2"
        >
          <Textarea
            id="programmeBullets"
            name="bullets"
            defaultValue={programme.bullets.join("\n")}
            className="min-h-28"
          />
        </Field>
        <Field label="Call to action" icon={ArrowRight} htmlFor="programmeCta">
          <Input id="programmeCta" name="cta" defaultValue={programme.cta} />
        </Field>
        <Field label="Meta line" icon={FileText} htmlFor="programmeMeta">
          <Input id="programmeMeta" name="meta" defaultValue={programme.meta} />
        </Field>
        <Field label="Cover image" icon={Image} hint="Upload a JPEG, PNG, WebP or GIF up to 5MB" className="sm:col-span-2">
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
        <Field label="Image alt text" icon={Eye} htmlFor="programmeImageAlt">
          <Input
            id="programmeImageAlt"
            name="imageAlt"
            defaultValue={programme.imageAlt}
            placeholder="Describe the image for screen readers"
          />
        </Field>
      </div>

      <div className="grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
        <label className="flex items-start gap-2.5 text-[12px] text-body">
          <input
            type="checkbox"
            name="featuredOnHome"
            defaultChecked={programme.featuredOnHome}
            className="mt-0.5 size-4 accent-[#2E8B2E]"
          />
          Featured on the homepage
        </label>
        <label className="flex items-start gap-2.5 text-[12px] text-body">
          <input
            type="checkbox"
            name="showOnProgrammes"
            defaultChecked={programme.showOnProgrammes}
            className="mt-0.5 size-4 accent-[#2E8B2E]"
          />
          Show on the programmes page
        </label>
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
          {pending ? "Saving…" : "Save programme"}
        </button>
      </div>
    </form>
  );
}
