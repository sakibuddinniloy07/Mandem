import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, client-side only. Importing this module from a
// "use client" component is safe during SSR because gsap no-ops safely
// without a DOM, but we still guard the ScrollTrigger registration since
// it touches `window`.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
