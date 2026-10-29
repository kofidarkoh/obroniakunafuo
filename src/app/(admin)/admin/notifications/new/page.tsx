"use client";

import { useActionState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { saveNotificationAction } from "@/app/admin-actions";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  StatusPill,
} from "@/components/admin/ui";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import type { FormState } from "@/lib/validation";
import { cn } from "@/lib/utils";

const initialState: FormState = { ok: false };

export function NotificationForm({
  existingSlug,
  notification,
}: {
  existingSlug?: string;
  notification?: { slug: string; title: string; summary: string; content: string; date: string; status: string };
}) {
  const [state, action, pending] = useActionState(
    saveNotificationAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-5">
      <input
        type="hidden"
        name="existingSlug"
        value={existingSlug ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" htmlFor="notificationSlug" required>
          <Input
            id="notificationSlug"
            name="slug"
            defaultValue={notification?.slug ?? ""}
            placeholder="e.g. urgent-food-appeal"
            required
          />
          <p className="mt-1 text-[9.5px] text-muted">
            URL-friendly identifier (lowercase, hyphens only)
          </p>
        </Field>
        <Field label="Status" htmlFor="notificationStatus">
          <Select id="notificationStatus" name="status" defaultValue={notification?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </Field>
      </div>

      <Field label="Title" htmlFor="notificationTitle" required>
        <Input
          id="notificationTitle"
          name="title"
          defaultValue={notification?.title ?? ""}
          required
        />
      </Field>

      <Field label="Summary" htmlFor="notificationSummary" required>
        <Textarea
          id="notificationSummary"
          name="summary"
          defaultValue={notification?.summary ?? ""}
          rows={3}
          required
        />
        <p className="mt-1 text-[9.5px] text-muted">
          Short description shown on the notifications list
        </p>
      </Field>

      <Field label="Date" htmlFor="notificationDate" required>
        <Input
          id="notificationDate"
          name="date"
          type="date"
          defaultValue={notification?.date ?? new Date().toISOString().slice(0, 10)}
          required
        />
      </Field>

      <Field label="Content" htmlFor="notificationContent" required>
        <Textarea
          id="notificationContent"
          name="content"
          defaultValue={notification?.content ?? ""}
          rows={10}
          required
        />
        <p className="mt-1 text-[9.5px] text-muted">
          Full announcement text. Use blank lines to separate paragraphs.
        </p>
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
              : "bg-grass text-white hover:bg-moss",
          )}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {pending ? "Saving…" : notification ? "Update announcement" : "Publish announcement"}
        </button>
        <Link
          href="/admin/notifications"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-[12px] font-medium text-ink hover:bg-paper"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to announcements
        </Link>
      </div>
    </form>
  );
}

export default function NewNotificationPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New announcement"
        description="Create a new public notification that will appear on the website."
        action={
          <Link
            href="/admin/notifications"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-4 text-[12px] font-medium text-ink hover:bg-paper"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to announcements
          </Link>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <NotificationForm />
      </AdminCard>
    </div>
  );
}
