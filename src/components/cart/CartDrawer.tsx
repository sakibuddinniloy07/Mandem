"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatBDT } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { lines, isOpen, close, setQty, removeItem } = useCartStore();
  const hydrated = useHydrated();
  const subtotal = hydrated ? cartSubtotal(lines) : 0;
  const shown = hydrated ? lines : [];

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 transition-opacity",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-ink/50" onClick={close} />
      <div
        className={clsx(
          "absolute right-0 top-0 h-full w-full sm:w-[420px] bg-paper flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-concrete-200">
          <span className="font-display uppercase tracking-wide text-lg">
            Your Bag {shown.length > 0 && `(${shown.length})`}
          </span>
          <button aria-label="Close cart" onClick={close} className="p-2 -mr-2">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4">
              <p className="font-display uppercase tracking-wide text-concrete-600">
                Your bag is empty
              </p>
              <Button href="/shop" variant="secondary" onClick={close}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-concrete-100">
              {shown.map((line) => (
                <li key={line.variantId} className="flex gap-4 p-5">
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={close}
                    className="relative w-20 h-24 bg-concrete-100 shrink-0 overflow-hidden"
                  >
                    <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={close}
                        className="font-display uppercase text-sm leading-tight hover:underline"
                      >
                        {line.name}
                      </Link>
                      <button
                        aria-label="Remove item"
                        onClick={() => removeItem(line.variantId)}
                        className="text-concrete-600 hover:text-ink shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-concrete-600 mt-1">
                      {line.color} / {line.size}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-concrete-400">
                        <button
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-concrete-100"
                          onClick={() => setQty(line.variantId, line.qty - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-display">{line.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-concrete-100"
                          onClick={() => setQty(line.variantId, line.qty + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-display text-sm">{formatBDT(line.price * line.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {shown.length > 0 && (
          <div className="border-t border-concrete-200 p-5 space-y-4">
            <div className="flex items-center justify-between font-display uppercase text-sm">
              <span>Subtotal</span>
              <span>{formatBDT(subtotal)}</span>
            </div>
            <p className="text-xs text-concrete-600">Shipping and payment calculated at checkout.</p>
            <Button href="/checkout" className="w-full" onClick={close}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
