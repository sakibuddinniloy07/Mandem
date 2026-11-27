"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/categories";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import clsx from "clsx";

const menuLinks = [
  { href: "/shop", label: "All Products" },
  ...categories.map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
  { href: "/orders", label: "Track Order" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;

  const countRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);
  const menuListRef = useRef<HTMLUListElement>(null);

  // Pop the cart count when an item is added.
  useEffect(() => {
    if (count > prevCount.current && countRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        countRef.current,
        { scale: 1.6 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
      );
    }
    prevCount.current = count;
  }, [count]);

  // Slide the header away while scrolling down, bring it back on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (y > 120 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y <= 120) setHidden(false);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll, support Escape, and stagger the links in while open.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);

    let ctx: gsap.Context | undefined;
    if (menuListRef.current && !prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.fromTo(
          menuListRef.current!.children,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.1 }
        );
      });
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      ctx?.revert();
    };
  }, [menuOpen]);

  return (
    <>
      {/* The full-screen menu is a sibling of <header>, not a child: the
          header uses a transform to hide on scroll, and a transformed
          ancestor would become the containing block for this fixed overlay
          (same class of bug as the earlier backdrop-blur drawer clipping). */}
      <header
        className={clsx(
          "sticky top-0 z-40 bg-sand text-wine transition-transform duration-300 ease-out",
          hidden && !menuOpen && "-translate-y-full"
        )}
      >
        <div className="container-max grid grid-cols-3 items-center px-5 md:px-10 h-20 md:h-24">
          <button
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="justify-self-start text-lg md:text-xl hover:opacity-70 transition-opacity"
          >
            Cart (<span ref={countRef} className="inline-block">{count}</span>)
          </button>

          <Link
            href="/"
            className="justify-self-center font-display italic font-black text-2xl md:text-[2rem] tracking-tight"
          >
            MANDEM<span className="align-super text-[10px] not-italic">®</span>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="justify-self-end p-2 -mr-2 group"
          >
            <span className="flex flex-col gap-[7px] w-9">
              <span className="block h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </header>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={clsx(
          "fixed inset-0 z-50 bg-sand text-wine transition-opacity duration-300 flex flex-col",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container-max w-full flex justify-end items-center px-5 md:px-10 h-20 md:h-24">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="relative w-10 h-10 -mr-1 group"
          >
            <span className="absolute left-1/2 top-1/2 w-9 h-px bg-current -translate-x-1/2 rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" />
            <span className="absolute left-1/2 top-1/2 w-9 h-px bg-current -translate-x-1/2 -rotate-45 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>
        <nav className="flex-1 flex items-start justify-center pt-6 md:pt-12 overflow-y-auto">
          <ul ref={menuListRef} className="flex flex-col items-center gap-5 md:gap-6 text-2xl md:text-3xl">
            {menuLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
