"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function CategoryTile({
  slug,
  name,
  image,
}: {
  slug: string;
  name: string;
  image?: string;
}) {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  function handleEnter() {
    if (prefersReducedMotion()) return;
    gsap.to(imgWrapRef.current, { scale: 1.08, duration: 0.6, ease: "power3.out" });
    gsap.to(overlayRef.current, { opacity: 0.95, duration: 0.4 });
    gsap.to(labelRef.current, { y: -3, duration: 0.3, ease: "back.out(2)" });
  }

  function handleLeave() {
    if (prefersReducedMotion()) return;
    gsap.to(imgWrapRef.current, { scale: 1, duration: 0.6, ease: "power3.out" });
    gsap.to(overlayRef.current, { opacity: 0.8, duration: 0.4 });
    gsap.to(labelRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
  }

  return (
    <Link
      href={`/shop/${slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative aspect-square bg-ink text-paper flex items-end p-4 overflow-hidden"
    >
      {image && (
        <div ref={imgWrapRef} className="absolute inset-0">
          <Image
            src={image}
            alt=""
            aria-hidden
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
      )}
      <span
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
        style={{ opacity: 0.8 }}
      />
      <span
        ref={labelRef}
        className="relative z-10 font-display uppercase text-sm md:text-base tracking-wide inline-block group-hover:text-accent transition-colors"
      >
        {name}
      </span>
    </Link>
  );
}
