"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  slug,
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  slug: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete this item? This cannot be undone in the current session.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-coral hover:bg-coral/10"
      >
        <Trash2 className="size-3" aria-hidden="true" />
        {label}
      </button>
    </form>
  );
}
