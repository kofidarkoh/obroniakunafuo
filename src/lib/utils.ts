import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGhs(amount: number, decimals = 0) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatGhc(amount: number, decimals = 0) {
  return `GHC ${new Intl.NumberFormat("en-GH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)}`;
}

export function formatDate(date: string | Date) {
  // Date-only strings are calendar dates, not instants. Parse them as local
  // dates so the displayed day does not shift with the server's time zone.
  const value =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(
          Number(date.slice(0, 4)),
          Number(date.slice(5, 7)) - 1,
          Number(date.slice(8, 10)),
        )
      : new Date(date);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TXN-${out}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://obroniakunafuo.org";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
