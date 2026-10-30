"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * A Link that warns before leaving a page with unsaved form changes.
 * StoryForm marks its <form> with data-dirty="true" while edited.
 */
export function GuardedLink({
  href,
  children,
  onClick,
  ...props
}: {
  href: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "children">) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        const dirty = document.querySelector('form[data-dirty="true"]');
        if (dirty && !window.confirm("Discard unsaved changes?")) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
