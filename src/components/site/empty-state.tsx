import type { ReactNode } from "react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

/**
 * Branded centred panel used by the 404 and error pages. Mirrors the
 * layout of SuccessPanel so confirmation and failure states feel related.
 */
export function EmptyState({
  code,
  eyebrow,
  title,
  description,
  tone = "moss",
  children,
}: {
  code: string;
  eyebrow: string;
  title: string;
  description: ReactNode;
  tone?: "moss" | "coral";
  children?: ReactNode;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[660px] px-5 py-16 text-center sm:py-20">
        <div
          className={cn(
            "mx-auto flex size-[96px] items-center justify-center rounded-full",
            tone === "coral" ? "bg-coral/10" : "bg-mint",
          )}
        >
          <span
            className={cn(
              "flex size-[72px] items-center justify-center rounded-full border-2",
              tone === "coral" ? "border-coral/30" : "border-grass/25",
            )}
          >
            <span
              className={cn(
                "text-[26px] font-bold tracking-tight",
                tone === "coral" ? "text-coral" : "text-grass",
              )}
            >
              {code}
            </span>
          </span>
        </div>

        <p
          className={cn(
            "eyebrow mt-8",
            tone === "coral" ? "text-coral" : "text-grass",
          )}
        >
          {eyebrow}
        </p>
        <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.02em] text-ink sm:text-[36px]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-body">
          {description}
        </p>

        {children ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Self-contained header/footer chrome for error pages that render outside a
 * route layout (root not-found, root error boundary).
 */
export function ErrorShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-line bg-white">
        <div className="container-oak flex h-16 items-center justify-between">
          <Logo tone="dark" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            OAK
          </span>
        </div>
      </header>
      <main id="main" className="flex-1 bg-white">
        {children}
      </main>
      <footer className="bg-ink text-white">
        <div className="container-oak flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="text-[11px] text-white/35">
            © {new Date().getFullYear()} Obroni Akunafo Kuo · Registered NGO,
            Ghana
          </p>
        </div>
      </footer>
    </div>
  );
}
