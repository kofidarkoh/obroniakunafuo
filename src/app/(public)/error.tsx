"use client";

import { useEffect } from "react";
import { Home, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/site/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default function PublicError({
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
    <>
      <EmptyState
        tone="coral"
        code="!"
        eyebrow="Something went wrong"
        title="This page hit an unexpected error"
        description="We couldn’t finish loading this page. Try again — if the problem keeps happening, please contact us and we’ll look into it."
      >
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-moss px-6 text-[15px] font-semibold text-white transition-colors hover:bg-forest"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
        <ButtonLink href="/" variant="outline" size="lg">
          <Home className="size-4" aria-hidden="true" />
          Return to homepage
        </ButtonLink>
      </EmptyState>
      {process.env.NODE_ENV !== "production" && error.message ? (
        <p className="mx-auto max-w-[660px] px-5 pb-12 text-center text-[11px] break-words text-muted">
          {error.message}
        </p>
      ) : null}
    </>
  );
}
