"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { formatBDT } from "@/lib/format";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1614031679232-0dae776a72ee?w=2000&q=80&auto=format&fit=crop";

type Promo = {
  slug: string;
  name: string;
  price: number;
  image?: string;
};

export function Hero({ promo }: { promo?: Promo }) {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Entrance: copy rises in line by line, photo settles, promo card slides up.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        textRef.current!.children,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }
      )
        .fromTo(imageRef.current, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, "-=0.6")
        .fromTo(cardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8");
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
    <section className="bg-sand text-wine">
      <div ref={textRef} className="text-center px-5 pt-6 md:pt-10 pb-10 md:pb-14 max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-serif)] italic font-medium text-5xl md:text-7xl leading-[1.05] tracking-tight">
          Built for the Everyday
        </h1>
        <p className="mt-4 md:mt-5 text-lg md:text-2xl leading-snug max-w-xl mx-auto">
          Heavyweight essentials cut in Dhaka, made to be worn hard and worn often.
        </p>
        <div className="mt-7 md:mt-9">
          <Link
            ref={ctaRef}
            href="/shop"
            className="inline-block border border-wine px-9 py-3 text-lg md:text-xl transition-colors duration-300 hover:bg-wine hover:text-sand"
          >
            Shop All
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9] bg-concrete-200">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Man in a black quilted jacket standing against a pale wall"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_25%]"
          />
        </div>

        {promo && (
          <div
            ref={cardRef}
            className="absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-2xl bg-sand p-3 md:p-4 flex gap-4 md:gap-6"
          >
            <Link
              href={`/product/${promo.slug}`}
              className="relative shrink-0 w-[38%] aspect-square overflow-hidden bg-concrete-200 group"
            >
              {promo.image && (
                <Image
                  src={promo.image}
                  alt={promo.name}
                  fill
                  sizes="(max-width: 768px) 40vw, 260px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </Link>
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              <div>
                <p className="font-[family-name:var(--font-serif)] italic font-semibold text-2xl md:text-4xl leading-tight">
                  Just dropped.
                </p>
                <p className="mt-1 md:mt-2 text-sm md:text-base truncate">{promo.name}</p>
              </div>
              <div className="flex items-end justify-between gap-3 mt-3">
                <span className="text-base md:text-xl">{formatBDT(promo.price)}</span>
                <Link
                  href={`/product/${promo.slug}`}
                  className="font-[family-name:var(--font-serif)] italic font-semibold text-xl md:text-2xl underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
