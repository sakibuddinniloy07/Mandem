"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const HERO_IMAGE = "/brand/hero-street.jpg";

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Entrance: copy rises in line by line, then the photo settles.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        textRef.current!.children,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }
      )
        .fromTo(imageRef.current, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, "-=0.6");
    });
    return () => ctx.revert();
  }, []);

  // Magnetic pull on the outlined CTA.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    function move(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    }
    function leave() {
      xTo(0);
      yTo(0);
    }
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    // Phones/tablets: copy stacked above the photo on sand.
    // Desktop (lg+): the photo fills the screen and slides up under the
    // transparent header (-mt-24 = header height); copy sits bottom-left in
    // white.
    <section className="relative bg-sand text-wine lg:-mt-24">
      <div
        ref={textRef}
        className="text-center px-5 pt-6 md:pt-10 pb-10 md:pb-14 max-w-3xl mx-auto lg:absolute lg:z-10 lg:left-[9%] lg:bottom-[11%] lg:p-0 lg:mx-0 lg:max-w-lg lg:text-left lg:text-white"
      >
        <h1 className="font-[family-name:var(--font-serif)] italic font-medium text-5xl md:text-7xl lg:text-6xl leading-[1.05] tracking-tight">
          Built for the Everyday
        </h1>
        <p className="mt-4 md:mt-5 lg:mt-4 text-lg md:text-2xl lg:text-xl leading-snug max-w-xl mx-auto lg:mx-0 lg:max-w-sm">
          Heavyweight essentials cut in Dhaka, made to be worn hard and worn often.
        </p>
        <div className="mt-7 md:mt-9 lg:mt-7">
          <Link
            ref={ctaRef}
            href="/shop"
            className="inline-block border border-wine px-9 py-3 text-lg md:text-xl transition-colors duration-300 hover:bg-wine hover:text-sand lg:border-white lg:hover:bg-white lg:hover:text-wine"
          >
            Shop All
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:h-screen lg:min-h-[640px] bg-concrete-200">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Man in a long dark coat and sunglasses walking between city buildings, in black and white"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-top"
          />
          {/* Darkens the lower-left corner on desktop so the white copy reads. */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
          {/* Fades the top of the photo into sand on desktop, so the header's
              dark text sits on a light band as in the reference design. */}
          <div className="hidden lg:block absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-sand via-sand/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
