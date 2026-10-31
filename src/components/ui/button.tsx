import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "lime"
  | "purple"
  | "orange"
  | "blue"
  | "outline"
  | "outline-light"
  | "outline-dark"
  | "dark"
  | "white"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60",
    size === "sm" && "h-9 px-4 text-[13px]",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-[15px]",
    variant === "primary" && "bg-emblem text-white hover:bg-forest-800",
    variant === "lime" && "bg-lime text-forest hover:bg-grass hover:text-white",
    variant === "purple" &&
      "bg-purple-bright text-white hover:bg-purple-deep",
    variant === "orange" && "bg-orange text-white hover:bg-amber",
    variant === "blue" && "bg-blue text-white hover:bg-[#1f5bd0]",
    variant === "outline" &&
      "border border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-ink/[0.04]",
    variant === "outline-light" &&
      "border border-white/25 bg-transparent text-white hover:bg-white/10",
    variant === "outline-dark" &&
      "border border-white/15 bg-white/[0.03] text-white hover:bg-white/10",
    variant === "dark" && "bg-ink text-white hover:bg-ink-900",
    variant === "white" && "bg-white text-ink hover:bg-paper",
    variant === "ghost" && "text-ink hover:bg-ink/[0.05]",
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
}

type ExternalButtonLinkProps = ComponentProps<"a"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ExternalButtonLink({
  variant,
  size,
  className,
  ...props
}: ExternalButtonLinkProps) {
  return (
    <a
      className={buttonStyles({ variant, size, className })}
      rel="noreferrer"
      {...props}
    />
  );
}
