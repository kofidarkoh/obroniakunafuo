"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  defaultOpen = [],
  className,
}: {
  items: { q: string; a: string }[];
  defaultOpen?: number[];
  className?: string;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set(defaultOpen));

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {items.map((item, index) => {
        const isOpen = open.has(index);
        return (
          <div
            key={item.q}
            className="h-fit rounded-[14px] border border-line bg-cream px-6 py-5"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <span className="flex items-start gap-2.5 text-[13px] font-semibold leading-relaxed text-ink">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                    isOpen
                      ? "border-grass bg-grass text-white"
                      : "border-grass/40 text-grass",
                  )}
                >
                  {isOpen ? (
                    <Minus className="size-2.5" />
                  ) : (
                    <Plus className="size-2.5" />
                  )}
                </span>
                {item.q}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-1 pl-6 pt-3 text-[12.5px] leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
