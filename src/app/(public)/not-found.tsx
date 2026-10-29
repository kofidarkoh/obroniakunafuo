import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/site/empty-state";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function PublicNotFound() {
  return (
    <EmptyState
      code="404"
      eyebrow="Page not found"
      title="We can’t find that page"
      description="The page you’re looking for may have been moved, renamed, or never existed. Try one of the links below."
    >
      <ButtonLink href="/" size="lg">
        <SearchX className="size-4" aria-hidden="true" />
        Return to homepage
      </ButtonLink>
      <ButtonLink href="/programmes" variant="outline" size="lg">
        Browse programmes
      </ButtonLink>
      <ButtonLink href="/stories" variant="outline" size="lg">
        Read stories
      </ButtonLink>
    </EmptyState>
  );
}
