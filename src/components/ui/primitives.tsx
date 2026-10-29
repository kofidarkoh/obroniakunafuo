import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2",
        tone === "light" && "text-muted",
        tone === "dark" && "text-white/60",
        tone === "green" && "text-grass",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0",
          tone === "dark" ? "bg-lime" : "bg-grass",
        )}
      />
      {children}
    </span>
  );
}

export function Badge({
  children,
  tone = "mint",
  className,
}: {
  children: ReactNode;
  tone?: "mint" | "purple" | "outline" | "dark" | "amber" | "blue" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide",
        tone === "mint" && "bg-mint text-forest",
        tone === "purple" && "bg-purple-deep/10 text-purple-deep",
        tone === "outline" && "border border-ink/15 text-body",
        tone === "dark" && "border border-white/20 bg-white/[0.06] text-white/80",
        tone === "amber" && "bg-amber/10 text-amber",
        tone === "blue" && "bg-blue/10 text-blue",
        tone === "neutral" && "bg-paper text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto text-center",
        )}
      >
        {eyebrow ? (
          <Eyebrow tone={tone === "dark" ? "dark" : "light"}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2
          className={cn(
            "display-2 mt-4",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 text-[15px] leading-relaxed sm:text-base",
              tone === "dark" ? "text-white/65" : "text-body",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  value,
  label,
  note,
  tone = "light",
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  note?: ReactNode;
  tone?: "light" | "dark" | "bare";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        tone === "light" &&
          "rounded-[14px] border border-line bg-white p-6 shadow-soft",
        tone === "dark" &&
          "rounded-[14px] border border-white/10 bg-white/[0.04] p-6",
        className,
      )}
    >
      <span
        className={cn(
          "text-4xl font-semibold tracking-tight",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "mt-2 text-sm font-medium",
          tone === "dark" ? "text-white/70" : "text-body",
        )}
      >
        {label}
      </span>
      {note ? (
        <span
          className={cn(
            "mt-3 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
            tone === "dark"
              ? "bg-lime/15 text-lime"
              : "bg-mint text-moss",
          )}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}

export function IconTile({
  children,
  tone = "mint",
  className,
}: {
  children: ReactNode;
  tone?: "mint" | "purple" | "amber" | "blue" | "dark" | "white";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-[12px]",
        tone === "mint" && "bg-mint text-moss",
        tone === "purple" && "bg-purple-deep/10 text-purple-deep",
        tone === "amber" && "bg-amber/10 text-amber",
        tone === "blue" && "bg-blue/10 text-blue",
        tone === "dark" && "bg-white/10 text-white",
        tone === "white" && "bg-white text-ink shadow-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BulletList({
  items,
  tone = "light",
  className,
}: {
  items: readonly string[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex items-start gap-2.5 text-sm leading-relaxed",
            tone === "dark" ? "text-white/70" : "text-body",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-1.5 size-1.5 shrink-0 rounded-full",
              tone === "dark" ? "bg-lime" : "bg-grass",
            )}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
