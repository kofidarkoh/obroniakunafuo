"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Folder,
  Heading2,
  Layers,
  Loader2,
  Pilcrow,
  Quote,
  Save,
  X,
} from "lucide-react";
import { saveStoryAction } from "@/app/admin-actions";
import { GuardedLink } from "@/components/admin/guarded-link";
import { ImageUploadButton } from "@/components/admin/image-upload-button";
import { AdminCard } from "@/components/admin/ui";
import {
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form";
import type { Story, StoryBlock } from "@/lib/stories";
import {
  blocksToBody,
  countWords,
  estimateReadTime,
  parseStoryBlocks,
} from "@/lib/story-format";
import { cn, formatDate, slugify } from "@/lib/utils";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

type PreviewData = {
  title: string;
  category: string;
  location: string;
  date: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  blocks: StoryBlock[];
  programmes: string[];
  pullQuote: string;
  pullQuoteAttribution: string;
};

const fieldIds: Record<string, string> = {
  title: "storyTitle",
  excerpt: "storyExcerpt",
  body: "storyBody",
  slug: "storySlug",
};

export function StoryForm({
  story,
  programmeOptions = [],
  categoryOptions = ["Community"],
  saved = false,
}: {
  story?: Story;
  programmeOptions?: string[];
  categoryOptions?: string[];
  saved?: boolean;
}) {
  const [state, action, pending] = useActionState(
    saveStoryAction,
    initialState,
  );
  const [imageValue, setImageValue] = useState(story?.image ?? "");
  const [status, setStatus] = useState<Story["status"]>(
    story?.status ?? "draft",
  );
  const [title, setTitle] = useState(story?.title ?? "");
  const [slug, setSlug] = useState(story?.slug ?? "");
  const [body, setBody] = useState(blocksToBody(story));
  const [excerpt, setExcerpt] = useState(story?.excerpt ?? "");
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const alertRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const closePreviewRef = useRef<HTMLButtonElement>(null);

  const effectiveSlug = slugify(slug) || slugify(title);
  const wordCount = countWords(body);
  const readTime = estimateReadTime(body);
  const titleError = state.errors?.title?.[0];
  const excerptError = state.errors?.excerpt?.[0];
  const bodyError = state.errors?.body?.[0];
  const slugError = state.errors?.slug?.[0];

  const programmes = Array.from(
    new Set([...programmeOptions, ...(story?.programmes ?? [])]),
  ).sort((a, b) => a.localeCompare(b));

  const submitLabel = pending
    ? "Saving…"
    : status === "draft"
      ? story
        ? "Save draft"
        : "Save as draft"
      : story
        ? story.status === "draft"
          ? "Publish story"
          : "Save changes"
        : "Publish story";

  useEffect(() => {
    if (!state.message) return;

    const firstError = ["title", "excerpt", "body", "slug"].find(
      (key) => state.errors?.[key]?.length,
    );

    if (firstError) {
      const field = document.getElementById(fieldIds[firstError]);
      field?.focus();
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  useEffect(() => {
    if (!dirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!previewOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closePreviewRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPreviewOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewOpen]);

  function applyBlockStyle(prefix: "## " | "> " | "") {
    const textarea = bodyRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = body.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    const nextNewline = body.indexOf("\n", end);
    const lineEnd = nextNewline === -1 ? body.length : nextNewline;
    const line = body.slice(lineStart, lineEnd);
    const stripped = line.replace(/^(## |> )/, "");
    const alreadyStyled = prefix !== "" && line.startsWith(prefix);
    const nextLine = `${alreadyStyled ? "" : prefix}${stripped}`;
    const nextBody =
      body.slice(0, lineStart) + nextLine + body.slice(lineEnd);

    setBody(nextBody);
    setDirty(true);

    const delta = nextLine.length - line.length;
    requestAnimationFrame(() => {
      textarea.focus();
      const position = Math.max(lineStart, start + delta);
      textarea.setSelectionRange(position, Math.max(position, end + delta));
    });
  }

  function openPreview() {
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const previewBody = String(data.get("body") ?? "");
    const previewTitle =
      String(data.get("title") ?? "").trim() || "Untitled story";
    const previewImage = String(data.get("image") ?? "");

    setPreview({
      title: previewTitle,
      category: String(data.get("category") ?? "").trim() || "Community",
      location: String(data.get("location") ?? "").trim() || "Ahafo Region",
      date: String(data.get("date") ?? ""),
      excerpt: String(data.get("excerpt") ?? ""),
      image: previewImage || "/images/hero-community.jpg",
      imageAlt:
        String(data.get("imageAlt") ?? "").trim() ||
        previewTitle ||
        "Story cover image",
      readTime: estimateReadTime(previewBody),
      blocks: parseStoryBlocks(previewBody),
      programmes: data.getAll("programmes").map(String).filter(Boolean),
      pullQuote: String(data.get("pullQuote") ?? "").trim(),
      pullQuoteAttribution: String(
        data.get("pullQuoteAttribution") ?? "",
      ).trim(),
    });
    setPreviewOpen(true);
  }

  function setPublishingStatus(nextStatus: Story["status"]) {
    setStatus(nextStatus);
    setDirty(true);
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-5"
      data-dirty={dirty ? "true" : "false"}
      onChange={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
    >
      {story ? (
        <input type="hidden" name="existingSlug" value={story.slug} />
      ) : null}

      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 -mt-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <GuardedLink
              href="/admin/stories"
              aria-label="Back to stories"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-paper"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </GuardedLink>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[15px] font-semibold tracking-tight text-ink">
                  {story ? "Edit story" : "New story"}
                </h2>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize",
                    status === "published"
                      ? "bg-mint text-moss"
                      : "bg-paper text-muted",
                  )}
                >
                  <span className="size-1 rounded-full bg-current" />
                  {status}
                </span>
              </div>
              <p className="truncate text-[10px] text-muted">
                {status === "draft"
                  ? "Draft — hidden from the public site"
                  : "Published — visible on the Stories page and homepage"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Publishing status"
              className="inline-flex rounded-lg border border-line bg-white p-0.5"
            >
              <button
                type="button"
                aria-pressed={status === "draft"}
                onClick={() => setPublishingStatus("draft")}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 text-[10.5px] font-semibold transition-colors",
                  status === "draft"
                    ? "bg-ink text-white"
                    : "text-muted hover:text-ink",
                )}
              >
                Draft
              </button>
              <button
                type="button"
                aria-pressed={status === "published"}
                onClick={() => setPublishingStatus("published")}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 text-[10.5px] font-semibold transition-colors",
                  status === "published"
                    ? "bg-emblem text-white"
                    : "text-muted hover:text-ink",
                )}
              >
                Published
              </button>
            </div>
            <input type="hidden" name="status" value={status} />
            <button
              type="button"
              onClick={openPreview}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[11.5px] font-medium text-ink transition-colors hover:bg-paper"
            >
              <Eye className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emblem px-4 text-[11.5px] font-semibold text-white transition-colors hover:bg-forest-800 disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-3.5" aria-hidden="true" />
              )}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] space-y-4">
        {saved ? (
          <div
            role="status"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-moss/20 bg-mint px-4 py-3 text-[12px] font-medium text-moss"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Story saved.
            </span>
            {story && status === "published" ? (
              <Link
                href={`/stories/${story.slug}`}
                target="_blank"
                className="font-semibold text-forest underline decoration-forest/25 underline-offset-2 hover:decoration-forest"
              >
                View live
              </Link>
            ) : (
              <span className="font-normal text-moss/80">
                It stays hidden until you publish.
              </span>
            )}
          </div>
        ) : null}

        {state.message ? (
          <p
            ref={alertRef}
            role="alert"
            className="rounded-lg bg-coral/10 px-3 py-2 text-[12px] font-medium text-coral"
          >
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="mx-auto grid max-w-[1180px] gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main writing column */}
        <div className="space-y-6">
          <AdminCard className="p-5 sm:p-6">
            <div>
              <label
                htmlFor="storyTitle"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Story title <span className="text-grass">*</span>
              </label>
              <Input
                id="storyTitle"
                name="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setDirty(true);
                }}
                placeholder="A decade of restored hope"
                required
                invalid={Boolean(titleError)}
                className="mt-2 h-auto rounded-none border-0 border-b border-line px-0 py-2 text-[24px] font-semibold tracking-tight hover:border-ink/20 focus:ring-0 sm:text-[28px]"
              />
              {titleError ? (
                <p role="alert" className="mt-1.5 text-[11px] font-medium text-coral">
                  {titleError}
                </p>
              ) : null}
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="storyExcerpt"
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
                >
                  Excerpt <span className="text-grass">*</span>
                </label>
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    excerpt.length > 220 ? "text-amber" : "text-muted",
                  )}
                >
                  {excerpt.length} / 220
                </span>
              </div>
              <Textarea
                id="storyExcerpt"
                name="excerpt"
                value={excerpt}
                onChange={(event) => {
                  setExcerpt(event.target.value);
                  setDirty(true);
                }}
                className="mt-2 min-h-24"
                placeholder="One or two sentences shown on story cards."
                required
                invalid={Boolean(excerptError)}
              />
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                Shown on the Stories page, homepage cards and search results.
                Aim for under 220 characters.
              </p>
              {excerptError ? (
                <p role="alert" className="mt-1 text-[11px] font-medium text-coral">
                  {excerptError}
                </p>
              ) : null}
            </div>
          </AdminCard>

          <AdminCard className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h3 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                  <FileText className="size-4 text-muted" aria-hidden="true" />
                  Story body <span className="text-grass">*</span>
                </h3>
                <p className="mt-1 text-[10.5px] text-muted">
                  Blank lines separate paragraphs.
                </p>
              </div>
              <p className="text-[10.5px] tabular-nums text-muted">
                {wordCount} {wordCount === 1 ? "word" : "words"} · ~{readTime}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 border-b border-line bg-paper/60 px-3 py-2 sm:px-4">
              {[
                { label: "Heading", icon: Heading2, prefix: "## " as const },
                { label: "Quote", icon: Quote, prefix: "> " as const },
                { label: "Paragraph", icon: Pilcrow, prefix: "" as const },
              ].map(({ label, icon: Icon, prefix }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => applyBlockStyle(prefix)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10.5px] font-medium text-body transition-colors hover:bg-white hover:text-ink"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
              <span className="ml-auto hidden text-[10px] text-muted sm:inline">
                Select a line, then choose a style
              </span>
            </div>

            <Textarea
              ref={bodyRef}
              id="storyBody"
              name="body"
              value={body}
              onChange={(event) => {
                setBody(event.target.value);
                setDirty(true);
              }}
              className="min-h-[420px] rounded-none border-0 px-5 py-4 text-[15px] leading-7 focus:ring-2 focus:ring-inset focus:ring-grass/20 sm:px-6"
              placeholder={
                "In 2016, Mr. Bernard Adu Tutu began visiting widows…\n\n## Four programmes. One mission.\n\n> True community means we are each other's keeper."
              }
              required
              invalid={Boolean(bodyError)}
            />

            <div className="border-t border-line px-5 py-3 sm:px-6">
              <p className="text-[10.5px] leading-relaxed text-muted">
                Use the toolbar for headings and quotes. A line starting with{" "}
                <code className="rounded bg-paper px-1 py-0.5 font-mono text-[9.5px]">
                  ##
                </code>{" "}
                becomes a heading, and{" "}
                <code className="rounded bg-paper px-1 py-0.5 font-mono text-[9.5px]">
                  &gt;
                </code>{" "}
                becomes a pull quote.
              </p>
              {bodyError ? (
                <p role="alert" className="mt-1.5 text-[11px] font-medium text-coral">
                  {bodyError}
                </p>
              ) : null}
            </div>
          </AdminCard>

          <details className="group rounded-[12px] border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2 text-[12px] font-semibold text-ink">
                <Quote className="size-4 text-muted" aria-hidden="true" />
                Pull quote
                <span className="font-normal text-muted">(optional)</span>
              </span>
              <ChevronDown
                className="size-4 text-muted transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-[minmax(0,1fr)_240px]">
              <Field label="Quote" htmlFor="storyPullQuote">
                <Textarea
                  id="storyPullQuote"
                  name="pullQuote"
                  defaultValue={story?.pullQuote.text}
                  className="min-h-24"
                  placeholder="A sentence worth repeating."
                />
              </Field>
              <Field
                label="Attribution"
                htmlFor="storyPullQuoteAttribution"
              >
                <Input
                  id="storyPullQuoteAttribution"
                  name="pullQuoteAttribution"
                  defaultValue={story?.pullQuote.attribution}
                  placeholder="Community beneficiary — Ahafo Region"
                />
              </Field>
            </div>
          </details>
        </div>

        {/* Publishing sidebar */}
        <aside className="space-y-5 xl:sticky xl:top-36 xl:self-start">
          <AdminCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Publishing
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize",
                  status === "published"
                    ? "bg-mint text-moss"
                    : "bg-paper text-muted",
                )}
              >
                <span className="size-1 rounded-full bg-current" />
                {status}
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              {status === "draft"
                ? "Drafts are only visible here in the admin. Publish when the story is ready for visitors."
                : "This story is live. Save changes to update the public page."}
            </p>
            <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Read time</dt>
                <dd className="font-medium text-ink">{readTime}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Surfaces</dt>
                <dd className="text-right font-medium text-ink">
                  Stories · Homepage
                </dd>
              </div>
            </dl>
            <div className="mt-4 rounded-lg bg-paper px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[10px] text-muted">
                <Clock className="size-3" aria-hidden="true" />
                Public URL
              </p>
              <p className="mt-1 truncate text-[10.5px] font-medium text-ink">
                /stories/{effectiveSlug || "…"}
              </p>
            </div>
            {story && status === "published" ? (
              <Link
                href={`/stories/${story.slug}`}
                target="_blank"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-grass hover:text-forest"
              >
                <Eye className="size-3.5" aria-hidden="true" />
                View live story
              </Link>
            ) : null}
          </AdminCard>

          <AdminCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Cover image
              </p>
              <span className="text-[10px] text-muted">Optional</span>
            </div>
            <div className="mt-3">
              <ImageUploadButton
                variant="cover"
                value={imageValue}
                onChange={(url) => {
                  setImageValue(url);
                  setDirty(true);
                }}
                onRemove={() => {
                  setImageValue("");
                  setDirty(true);
                }}
              />
            </div>
            <input type="hidden" name="image" value={imageValue} />
            <div className="mt-4">
              <Field
                label="Alt text"
                htmlFor="storyImageAlt"
                hint="Describe the image for screen readers. Defaults to the title if left blank."
              >
                <Input
                  id="storyImageAlt"
                  name="imageAlt"
                  defaultValue={story?.imageAlt}
                  placeholder="Women gathered under a tree in the Ahafo Region"
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Story details
            </p>
            <div className="mt-4 space-y-4">
              <Field label="Category" htmlFor="storyCategory">
                <Select
                  id="storyCategory"
                  name="category"
                  defaultValue={story?.category ?? "Community"}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Location" htmlFor="storyLocation">
                <Input
                  id="storyLocation"
                  name="location"
                  defaultValue={story?.location ?? "Ahafo Region"}
                />
              </Field>
              <Field label="Date" htmlFor="storyDate">
                <Input
                  id="storyDate"
                  name="date"
                  type="date"
                  defaultValue={
                    story?.date ?? new Date().toISOString().slice(0, 10)
                  }
                />
              </Field>

              <details
                className="group border-t border-line pt-4"
                open={slugError ? true : undefined}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-medium text-body [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-1.5">
                    <Folder className="size-3.5 text-muted" aria-hidden="true" />
                    URL slug
                  </span>
                  <ChevronDown
                    className="size-3.5 text-muted transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-3">
                  <Field
                    label="Slug"
                    htmlFor="storySlug"
                    error={slugError}
                    hint={
                      story
                        ? "Changing the slug changes the public URL. Old links will stop working."
                        : "Leave blank to generate from the title."
                    }
                  >
                    <Input
                      id="storySlug"
                      name="slug"
                      value={slug}
                      onChange={(event) => {
                        setSlug(event.target.value);
                        setDirty(true);
                      }}
                      placeholder="a-decade-of-restored-hope"
                      invalid={Boolean(slugError)}
                    />
                  </Field>
                  <p className="mt-1.5 truncate text-[10px] text-muted">
                    Public URL:{" "}
                    <span className="font-medium text-ink">
                      /stories/{effectiveSlug || "…"}
                    </span>
                  </p>
                </div>
              </details>
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <fieldset>
              <legend className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                <Layers className="size-3.5" aria-hidden="true" />
                Programmes
              </legend>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                Select every programme this story relates to.
              </p>
              {programmes.length > 0 ? (
                <div className="mt-3 space-y-2.5">
                  {programmes.map((programme) => (
                    <Checkbox
                      key={programme}
                      name="programmes"
                      value={programme}
                      defaultChecked={story?.programmes.includes(programme)}
                      label={
                        <span className="text-[11.5px] leading-snug">
                          {programme}
                        </span>
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-[10.5px] text-muted">
                  No programmes have been created yet.
                </p>
              )}
            </fieldset>
          </AdminCard>

          <div className="flex items-start gap-2 px-1 text-[10px] leading-relaxed text-muted">
            <Calendar className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
            <p>
              The date, location, cover image and programmes appear on the
              public story page and cards.
            </p>
          </div>
        </aside>
      </div>

      {previewOpen && preview ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-preview-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewOpen(false);
          }}
        >
          <div className="my-auto flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <Eye className="size-3.5 text-muted" aria-hidden="true" />
                <p
                  id="story-preview-title"
                  className="text-[12px] font-semibold text-ink"
                >
                  Story preview
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize",
                    status === "published"
                      ? "bg-mint text-moss"
                      : "bg-paper text-muted",
                  )}
                >
                  <span className="size-1 rounded-full bg-current" />
                  {status}
                </span>
              </div>
              <button
                ref={closePreviewRef}
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-paper hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto">
              <div className="relative aspect-[16/9] bg-mint">
                <Image
                  src={preview.image}
                  alt={preview.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
              <article className="px-5 py-7 sm:px-9 sm:py-9">
                <span className="inline-flex rounded-full bg-mint px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-moss">
                  {preview.category} · {preview.location}
                </span>
                <h1 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
                  {preview.title}
                </h1>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-muted">
                  <span>
                    {preview.date
                      ? formatDate(preview.date)
                      : "Date not set"}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{preview.readTime}</span>
                </p>
                <p className="mt-5 border-l-2 border-grass pl-4 text-[13.5px] leading-relaxed text-body">
                  {preview.excerpt || "Your excerpt will appear here."}
                </p>
                <div className="mt-7 space-y-5">
                  {preview.blocks.length === 0 ? (
                    <p className="text-[13px] text-muted">
                      Your story body will appear here.
                    </p>
                  ) : (
                    preview.blocks.map((block, index) => {
                      if (block.type === "h2") {
                        return (
                          <h2
                            key={index}
                            className="pt-1 text-xl font-semibold tracking-tight text-ink"
                          >
                            {block.text}
                          </h2>
                        );
                      }
                      if (block.type === "quote") {
                        return (
                          <blockquote
                            key={index}
                            className="rounded-[8px] border-l-[3px] border-grass bg-mint px-5 py-4 text-[13px] leading-relaxed text-ink"
                          >
                            &ldquo;{block.text}&rdquo;
                          </blockquote>
                        );
                      }
                      return (
                        <p
                          key={index}
                          className="text-[13.5px] leading-[1.85] text-body"
                        >
                          {block.text}
                        </p>
                      );
                    })
                  )}
                </div>
                {preview.programmes.length > 0 ? (
                  <div className="mt-7 flex flex-wrap gap-2 border-t border-line pt-5">
                    {preview.programmes.map((programme) => (
                      <span
                        key={programme}
                        className="rounded-full bg-paper px-2.5 py-1 text-[9.5px] font-medium text-body"
                      >
                        {programme}
                      </span>
                    ))}
                  </div>
                ) : null}
                {preview.pullQuote ? (
                  <blockquote className="mt-7 rounded-[10px] bg-mint px-5 py-4 text-[13px] leading-relaxed text-ink">
                    &ldquo;{preview.pullQuote}&rdquo;
                    {preview.pullQuoteAttribution ? (
                      <footer className="mt-2 text-[10px] text-muted">
                        {preview.pullQuoteAttribution}
                      </footer>
                    ) : null}
                  </blockquote>
                ) : null}
              </article>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
