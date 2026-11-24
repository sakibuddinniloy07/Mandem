"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
// Importing "@/lib/gsap" (rather than "gsap" directly) ensures the
// ScrollTrigger plugin used by `scrollTrigger:` below is registered first.

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger children of the wrapper in instead of animating it as one block. */
  stagger?: number;
  /** Extra delay in seconds before the animation starts. */
  delay?: number;
  /** Pixels to travel on the way in. */
  distance?: number;
};

export function Reveal({ children, className, stagger, delay = 0, distance = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: distance });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        ease: "power3.out",
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
