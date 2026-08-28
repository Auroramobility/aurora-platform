"use client";

import { useState } from "react";

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
      <div className="overflow-hidden rounded-3xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]!}
          alt={`${name} — image ${active + 1} of ${images.length}`}
          className="h-[320px] w-full object-cover transition duration-300 sm:aspect-[16/10] sm:h-[400px] sm:h-auto lg:aspect-auto lg:h-[480px]"
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
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
