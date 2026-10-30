"use client";

import { Check, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage } from "@/app/(admin)/actions/upload";
import { cn } from "@/lib/utils";

export function ImageUploadButton({
  value,
  onChange,
  accept = "image/*",
  variant = "inline",
  onRemove,
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  variant?: "inline" | "cover";
  onRemove?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsPending(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImage(formData);
      if (result?.url) {
        onChange(result.url);
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error && error.message
          ? error.message
          : "Image upload failed. Please try again.",
      );
    } finally {
      setIsPending(false);
      event.target.value = "";
    }
  }

  const uploadButton = (
    <button
      type="button"
      onClick={() => fileInput.current?.click()}
      disabled={isPending}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white font-medium transition-colors hover:bg-paper disabled:opacity-60",
        variant === "cover"
          ? "h-9 px-3.5 text-[11.5px]"
          : "px-3 py-1.5 text-[11px]",
      )}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Upload className="size-3.5" aria-hidden="true" />
      )}
      {isPending
        ? "Uploading…"
        : value
          ? "Replace image"
          : variant === "cover"
            ? "Upload cover"
            : "Upload image"}
    </button>
  );

  if (variant === "cover") {
    return (
      <div className="space-y-3">
        <input
          ref={fileInput}
          type="file"
          accept={accept}
          onChange={handleChange}
          aria-label="Upload image"
          className="sr-only"
        />
        <div
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[10px] border border-dashed bg-paper",
            error ? "border-coral/50" : "border-line",
          )}
        >
          {value ? (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${value.replace(/"/g, "%22")}")`,
                }}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-3 pb-2.5 pt-10 text-[10px] font-medium text-white">
                Cover preview
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-muted">
                <ImagePlus className="size-4" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-medium text-ink">
                Add a cover image
              </span>
              <span className="text-[10px] leading-relaxed text-muted">
                JPEG, PNG, WebP or GIF · up to 5MB
              </span>
            </div>
          )}
          {isPending ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2
                className="size-5 animate-spin text-grass"
                aria-hidden="true"
              />
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {uploadButton}
          {value && onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              disabled={isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-muted transition-colors hover:bg-coral/10 hover:text-coral disabled:opacity-60"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Remove
            </button>
          ) : null}
          {value && !error ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-moss">
              <Check className="size-3" aria-hidden="true" />
              Image ready
            </span>
          ) : null}
        </div>
        {error ? (
          <p className="text-[10.5px] leading-snug text-coral">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <input
        ref={fileInput}
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label="Upload image"
        className="sr-only"
      />
      {uploadButton}
      {error ? (
        <span className="max-w-[260px] text-[10px] leading-snug break-words text-coral">
          {error}
        </span>
      ) : value ? (
        <span className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="size-8 shrink-0 rounded-md border border-line bg-paper bg-cover bg-center"
            style={{ backgroundImage: `url("${value.replace(/"/g, "%22")}")` }}
          />
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-moss">
            <Check className="size-3" aria-hidden="true" />
            Image ready
          </span>
        </span>
      ) : (
        <span className="text-[10px] text-muted">No image selected</span>
      )}
    </div>
  );
}
