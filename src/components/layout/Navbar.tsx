"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { categories } from "@/lib/categories";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import clsx from "clsx";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-concrete-200">
      <div className="h-11 bg-ink text-paper text-[11px] md:text-xs font-display uppercase tracking-widest flex items-center justify-center text-center px-4">
        Free delivery inside Dhaka on orders over ৳2,500 &mdash; Cash on Delivery &amp; bKash available
      </div>
      <div className="container-max flex items-center justify-between px-4 md:px-6 h-16 md:h-20">
        <button
          className="md:hidden p-2 -ml-2"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="font-display italic font-black text-2xl md:text-3xl tracking-tight">
          MANDEM<span className="align-super text-[10px] not-italic">®</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-display uppercase text-sm tracking-wide">
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="hover:text-concrete-600 transition-colors">
              {c.name}
            </Link>
          ))}
          <Link href="/shop" className="hover:text-concrete-600 transition-colors">
            All Products
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/shop" aria-label="Search products" className="hidden sm:inline-flex p-2 hover:text-concrete-600">
            <Search size={20} />
          </Link>
          <Link href="/orders" className="hidden sm:inline-flex font-display uppercase text-xs tracking-wide px-3 py-2 hover:text-concrete-600">
            Track Order
          </Link>
          <button
            aria-label="Open cart"
            className="relative p-2 hover:text-concrete-600"
            onClick={openCart}
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-ink text-paper text-[10px] font-display w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-50 md:hidden transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-ink/50"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={clsx(
            "absolute left-0 top-0 h-full w-[82%] max-w-xs bg-paper transition-transform duration-300 flex flex-col",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-16 px-5 border-b border-concrete-200">
            <span className="font-display italic font-black text-xl">MANDEM</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2 -mr-2">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col py-2 font-display uppercase tracking-wide text-base overflow-y-auto">
            <Link href="/shop" onClick={() => setMobileOpen(false)} className="px-5 py-3.5 border-b border-concrete-100">
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="px-5 py-3.5 border-b border-concrete-100"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/orders" onClick={() => setMobileOpen(false)} className="px-5 py-3.5 border-b border-concrete-100">
              Track Order
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
