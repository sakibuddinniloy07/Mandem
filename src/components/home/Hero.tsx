"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function Hero({ children }: { children: ReactNode }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(imageRef.current, { scale: 1.08, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 1.4 }).fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[21/8] overflow-hidden bg-concrete-100">
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/brand/hero-wide.jpg"
          alt="MANDEM — Men's Apparel, Estd 2K26"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-10 md:pb-16 px-4">
        <div ref={ctaRef}>{children}</div>
      </div>
    </section>
  );
}
