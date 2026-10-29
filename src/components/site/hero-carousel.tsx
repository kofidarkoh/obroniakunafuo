"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "/images/hero-community.jpg",
    alt: "Community members preparing a meal together in Mim, Ahafo Region",
  },
  {
    src: "/images/programmes/education.jpg",
    alt: "Children learning together in a classroom supported by OAK",
  },
  {
    src: "/images/programmes/health.jpg",
    alt: "A carer supporting an elderly woman during a home visit",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div className="relative aspect-[7/8] w-full overflow-hidden rounded-[20px] bg-white/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 360px, 90vw"
            className={cn(
              "object-cover transition-opacity duration-700",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show image ${i + 1} of ${slides.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "size-2 rounded-full transition-all",
              i === index ? "w-5 bg-lime" : "bg-white/35 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}
