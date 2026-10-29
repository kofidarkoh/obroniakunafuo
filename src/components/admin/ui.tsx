import type { ReactNode } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-line bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminStat({
  label,
  value,
  note,
  icon,
  href,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  note?: string;
  icon?: ReactNode;
  href?: string;
  tone?: "default" | "green" | "amber" | "purple" | "coral";
}) {
  const content = (
    <div className="flex items-start justify-between gap-4 p-5">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          {value}
        </p>
        {note ? <p className="mt-1 text-[10.5px] text-muted">{note}</p> : null}
      </div>
      {icon ? (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[8px]",
            tone === "default" && "bg-paper text-muted",
            tone === "green" && "bg-mint text-moss",
            tone === "amber" && "bg-amber/10 text-amber",
            tone === "purple" && "bg-purple-deep/10 text-purple-deep",
            tone === "coral" && "bg-coral/10 text-coral",
          )}
        >
          {icon}
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-[12px] border border-line bg-white transition-colors hover:border-ink/20"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-[12px] border border-line bg-white">{content}</div>
  );
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber/10 text-amber",
  confirmed: "bg-mint text-moss",
  cancelled: "bg-coral/10 text-coral",
  new: "bg-blue/10 text-blue",
  reviewed: "bg-mint text-moss",
  archived: "bg-paper text-muted",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-semibold capitalize",
        statusStyles[status] ?? "bg-paper text-muted",
      )}
    >
      <span className="size-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-[11.5px] leading-relaxed text-muted">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminSearchForm({
  action,
  placeholder,
  defaultValue,
  hidden = {},
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form
      action={action}
      method="get"
      className="flex flex-1 items-center gap-2 sm:w-80 md:w-96"
    >
      {Object.entries(hidden).map(([name, value]) =>
        value && value !== "all" ? (
          <input key={name} type="hidden" name={name} value={value} />
        ) : null,
      )}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          name="search"
          aria-label={placeholder}
          placeholder={placeholder}
          defaultValue={defaultValue ?? ""}
          className="block w-full rounded-lg border border-line py-1.5 pl-9 pr-3 text-[11.5px] transition-colors focus:border-ink focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg border border-line px-3 py-1.5 text-[11.5px] font-medium text-body transition-colors hover:bg-paper"
      >
        Search
      </button>
    </form>
  );
}
