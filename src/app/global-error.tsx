"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

/**
 * Last-resort error boundary. Replaces the root layout entirely, so it must
 * render its own <html>/<body>, pull in the global styles directly, and define
 * the font variable the theme normally gets from next/font.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ ["--font-inter" as string]: "Inter, ui-sans-serif" }}
    >
      <body
        className="flex min-h-full flex-col bg-ink text-white antialiased"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="w-full max-w-[560px] text-center">
            <div className="mx-auto flex size-[96px] items-center justify-center rounded-full bg-white/[0.06]">
              <span className="flex size-[72px] items-center justify-center rounded-full border-2 border-coral/40">
                <span className="text-[26px] font-bold text-coral">!</span>
              </span>
            </div>

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-coral">
              Something went wrong
            </p>
            <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.02em] sm:text-[34px]">
              An unexpected error occurred
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/60">
              The site hit an unexpected problem while loading. Try again, or
              return to the homepage.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-white px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-paper"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-[10px] border border-white/25 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Return home
              </Link>
            </div>

            {process.env.NODE_ENV !== "production" && error.message ? (
              <p className="mt-8 text-[11px] break-words text-white/40">
                {error.message}
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
