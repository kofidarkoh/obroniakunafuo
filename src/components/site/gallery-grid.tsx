"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  caption: string;
  category: string;
};

export function GalleryGrid({ items }: { items: Item[] }) {
  const [active, setActive] = useState<Item | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setActive(item)}
            className="group overflow-hidden rounded-xl border border-line bg-paper text-left transition hover:shadow-soft"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="px-3 py-2">
              <p className="truncate text-[12px] font-medium text-ink">
                {item.title}
              </p>
              {item.caption ? (
                <p className="mt-0.5 line-clamp-2 text-[10.5px] text-muted">
                  {item.caption}
                </p>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <div className="relative max-h-[70vh] w-full">
              <Image
                src={active.image}
                alt={active.imageAlt}
                width={1200}
                height={800}
                className="h-auto max-h-[70vh] w-full object-contain bg-paper"
              />
            </div>
            <div className="space-y-1 px-5 py-4">
              <p className="text-[14px] font-semibold text-ink">{active.title}</p>
              {active.caption ? (
                <p className="text-[11.5px] leading-relaxed text-muted">
                  {active.caption}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}