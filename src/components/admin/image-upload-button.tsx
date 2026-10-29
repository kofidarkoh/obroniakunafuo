"use client";

import { Upload, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage } from "@/app/(admin)/actions/upload";

export function ImageUploadButton({
  value,
  onChange,
  accept = "image/*",
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
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

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInput}
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label="Upload image"
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-paper disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="size-3.5" aria-hidden="true" />
        )}
        {isPending ? "Uploading…" : "Upload image"}
      </button>
      {error ? (
        <span className="text-[10px] text-coral truncate max-w-[200px]">
          {error}
        </span>
      ) : (
        <span className="text-[10px] text-muted truncate max-w-[200px]">
          {value || "No image selected"}
        </span>
      )}
    </div>
  );
}
