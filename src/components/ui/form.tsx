import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-[10px] border bg-white text-sm text-ink placeholder:text-muted/60 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-grass/20 disabled:cursor-not-allowed disabled:bg-paper disabled:text-muted";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
  icon: Icon,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-[13px] font-medium text-ink"
        >
          {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
          {label}
          {required ? (
            <span className="ml-1 text-grass" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-coral">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "h-12 px-4",
        invalid ? "border-coral" : "border-line hover:border-ink/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "min-h-32 resize-y px-4 py-3",
        invalid ? "border-coral" : "border-line hover:border-ink/20",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  ...props
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "select-oak h-12 cursor-pointer px-4",
        invalid ? "border-coral" : "border-line hover:border-ink/20",
        className,
      )}
      {...props}
    />
  );
}

export function Checkbox({
  className,
  label,
  description,
  ...props
}: ComponentProps<"input"> & { label: ReactNode; description?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-body">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 size-4 shrink-0 cursor-pointer rounded-[4px] border-line accent-[#2E8B2E]",
          className,
        )}
        {...props}
      />
      <span>
        <span className="block leading-relaxed">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export function FormStepHeader({
  step,
  title,
  description,
  className,
}: {
  step: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-mint text-[11px] font-bold text-forest">
        {step}
      </span>
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
