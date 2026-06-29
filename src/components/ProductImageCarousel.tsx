"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type ProductImageCarouselProps = {
  images: string[];
  name: string;
  priority?: boolean;
};

export function ProductImageCarousel({
  images,
  name,
  priority = false,
}: ProductImageCarouselProps) {
  const safeImages = images.length ? images : ["/swan.svg"];
  const [index, setIndex] = useState(0);
  const image = safeImages[index];

  function show(delta: number) {
    setIndex((current) => (current + delta + safeImages.length) % safeImages.length);
  }

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#151010]">
      <Image
        src={image}
        alt={`${name} image ${index + 1}`}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
      {safeImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              show(-1);
            }}
            className="absolute left-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              show(1);
            }}
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
            aria-label="Next image"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {safeImages.map((item, itemIndex) => (
              <button
                type="button"
                key={`${item}-${itemIndex}`}
                onClick={(event) => {
                  event.preventDefault();
                  setIndex(itemIndex);
                }}
                className={`size-1.5 rounded-full ${
                  itemIndex === index ? "bg-white" : "bg-white/35"
                }`}
                aria-label={`Show image ${itemIndex + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
