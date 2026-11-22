"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-[4/5] bg-concrete-100 overflow-hidden">
        <Image src={images[active]} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={clsx(
                "relative w-16 h-20 bg-concrete-100 overflow-hidden border",
                active === i ? "border-ink" : "border-transparent"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
