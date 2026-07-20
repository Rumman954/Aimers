"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

type CourseImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function CourseImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: CourseImageProps) {
  const [current, setCurrent] = useState(src || FALLBACK);
  const isDataUrl = current.startsWith("data:image/");

  return (
    <>
      {isDataUrl ? (
        // Next/Image can be picky with data-URLs in some configurations.
        // For uploaded thumbnails we render with a plain <img> instead.
        <img
          src={current}
          alt={alt}
          className={cn("absolute inset-0 object-cover", className)}
          onError={() => {
            if (current !== FALLBACK) setCurrent(FALLBACK);
          }}
        />
      ) : (
        <Image
          src={current}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover", className)}
          sizes={sizes}
          onError={() => {
            if (current !== FALLBACK) setCurrent(FALLBACK);
          }}
        />
      )}
    </>
  );
}
