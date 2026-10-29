import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/oak-logo.png"
      alt=""
      width={96}
      height={96}
      className={cn("size-10 shrink-0 rounded-full object-contain", className)}
    />
  );
}

export function Logo({
  tone = "light",
  className,
  href = "/",
}: {
  tone?: "light" | "dark";
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-3", className)}
      aria-label="Obroni Akunafo Kuo — home"
    >
      <LogoMark className="size-10 transition-transform duration-300 group-hover:rotate-3" />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate text-[19px] font-semibold leading-tight tracking-[-0.02em] sm:text-[21px]",
            tone === "dark" ? "text-ink" : "text-white",
          )}
        >
          Obroni Akunafo Kuo
        </span>
        <span
          className={cn(
            "mt-0.5 truncate text-[9.5px] font-medium uppercase tracking-[0.06em]",
            tone === "dark" ? "text-muted" : "text-white/45",
          )}
        >
          Obaa Kunani — Awurade Ne Me Boafo
        </span>
      </span>
    </Link>
  );
}
