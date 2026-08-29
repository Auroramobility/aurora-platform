"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  name: string;
};

export function VehicleGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-3xl border bg-muted text-muted-foreground sm:h-[400px] lg:h-[480px]">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-muted sm:aspect-[16/10]">
        <Image
          src={images[active]!}
          alt={`${name} — image ${active + 1} of ${images.length}`}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition duration-300"
        />
      </div>

      {/* Thumbnails — only shown when more than 1 image */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
