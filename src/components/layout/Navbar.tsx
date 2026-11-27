"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import clsx from "clsx";

const navLinks = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/shop", label: "All Products" },
  { href: "/about", label: "About Us" },
];
const menuLinks = [...navLinks, { href: "/orders", label: "Track Order" }];

const underline =
  "relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const isHome = usePathname() === "/";
  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;

  const headerRef = useRef<HTMLElement>(null);
  const prevCount = useRef(count);
  const menuListRef = useRef<HTMLUListElement>(null);

  // Pop the cart count when an item is added.
  useEffect(() => {
    const counts = headerRef.current?.querySelectorAll("[data-cart-count]");
    if (count > prevCount.current && counts?.length && !prefersReducedMotion()) {
      gsap.fromTo(counts, { scale: 1.6 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    }
    prevCount.current = count;
  }, [count]);

  // Slide the header away while scrolling down, bring it back on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setAtTop(y < 8);
      if (y > 120 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y <= 120) setHidden(false);
      lastY = y;
    }
    onScroll();
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

  // On the home page (desktop), the header floats transparently over the
  // full-bleed hero photo until the page is scrolled.
  const overHero = isHome && atTop && !menuOpen;

  const cartButton = (className: string) => (
    <button
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className={clsx("text-lg md:text-xl hover:opacity-70 transition-opacity", className)}
    >
      Cart (<span data-cart-count className="inline-block">{count}</span>)
    </button>
  );

  return (
    <>
      {/* The full-screen menu is a sibling of <header>, not a child: the
          header uses a transform to hide on scroll, and a transformed
          ancestor would become the containing block for this fixed overlay. */}
      <header
        ref={headerRef}
        className={clsx(
          "sticky top-0 z-40 text-ink transition-[translate,background-color,box-shadow] duration-300 ease-out",
          "bg-sand",
          overHero && "lg:bg-transparent",
          // The page is the same beige as the header, so once scrolled a
          // hairline keeps the header distinct from the content beneath it.
          !atTop && "shadow-[0_1px_0_var(--color-concrete-200)]",
          hidden && !menuOpen && "-translate-y-full"
        )}
      >
        <div className="mx-auto max-w-[1400px] grid grid-cols-3 items-center px-5 md:px-10 h-20 md:h-24 lg:flex lg:justify-between lg:max-w-none lg:px-14">
          {cartButton("justify-self-start lg:hidden")}

          <div className="justify-self-center lg:flex lg:items-center lg:gap-10">
            <Link
              href="/"
              className="font-display italic font-black text-2xl md:text-[2rem] tracking-tight"
            >
              MANDEM<span className="align-super text-[10px] not-italic">®</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-lg">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className={underline}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="justify-self-end flex items-center">
            <div className="hidden lg:flex items-center gap-8">
              {cartButton("")}
              <Link href="/orders" className="flex items-center gap-2.5 text-lg group">
                <CircleUserRound size={34} strokeWidth={1.25} className="transition-transform duration-300 group-hover:scale-110" />
                <span className={underline}>Track Order</span>
              </Link>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="lg:hidden p-2 -mr-2 group"
            >
              <span className="flex flex-col gap-[7px] w-9">
                <span className="block h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
                <span className="block h-px bg-current" />
                <span className="block h-px bg-current transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={clsx(
          "fixed inset-0 z-50 bg-sand text-ink transition-opacity duration-300 flex flex-col lg:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="w-full flex justify-end items-center px-5 md:px-10 h-20 md:h-24">
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
                <Link href={l.href} onClick={() => setMenuOpen(false)} className={underline}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialIcons size={24} className="justify-center gap-6 pb-10 pt-6" />
      </div>
    </>
  );
}
