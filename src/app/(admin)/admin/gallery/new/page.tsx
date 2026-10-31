"use client";

import { useActionState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { saveGalleryAction } from "@/app/admin-actions";
import {
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageUploadButton } from "@/components/admin/image-upload-button";
import type { FormState } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const initialState: FormState = { ok: false };

export function GalleryForm({
  existingSlug,
  item,
}: {
  existingSlug?: string;
  item?: {
    slug: string;
    title: string;
    image: string;
    imageAlt: string;
    caption: string;
    category: string;
    status: string;
  };
}) {
  const [state, action, pending] = useActionState(saveGalleryAction, initialState);
  const [image, setImage] = useState(item?.image ?? "");

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="existingSlug" value={existingSlug ?? ""} />
      <input type="hidden" name="image" value={image} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" htmlFor="gallerySlug" required>
          <Input
            id="gallerySlug"
            name="slug"
            defaultValue={item?.slug ?? ""}
            placeholder="e.g. community-outreach-2026"
            required
          />
        </Field>
        <Field label="Status" htmlFor="galleryStatus">
          <Select id="galleryStatus" name="status" defaultValue={item?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </Field>
      </div>

      <Field label="Title" htmlFor="galleryTitle" required>
        <Input id="galleryTitle" name="title" defaultValue={item?.title ?? ""} required />
      </Field>

      <Field label="Image" htmlFor="galleryImage" required>
        <ImageUploadButton value={image} onChange={setImage} variant="cover" />
      </Field>

      <Field label="Alt text" htmlFor="galleryAlt">
        <Input id="galleryAlt" name="imageAlt" defaultValue={item?.imageAlt ?? ""} />
      </Field>

      <Field label="Category" htmlFor="galleryCategory">
        <Input id="galleryCategory" name="category" defaultValue={item?.category ?? ""} placeholder="e.g. Events" />
      </Field>

      <Field label="Caption" htmlFor="galleryCaption">
        <Textarea
          id="galleryCaption"
          name="caption"
          defaultValue={item?.caption ?? ""}
          rows={3}
        />
      </Field>

      {state.message ? (
        <p className="rounded-lg bg-coral/10 px-3 py-2 text-[12px] font-medium text-coral">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors",
            pending
              ? "bg-muted text-muted cursor-not-allowed"
              : "bg-emblem text-white hover:bg-forest-800",
          )}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {pending ? "Saving…" : item ? "Update image" : "Publish image"}
        </button>
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-[12px] font-medium text-ink hover:bg-paper"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to gallery
        </Link>
      </div>
    </form>
  );
}

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New gallery image"
        description="Add a new photo to the public gallery."
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
        <GalleryForm />
      </AdminCard>
    </div>
  );
}