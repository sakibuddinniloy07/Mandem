"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatBDT } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { lines, setQty, removeItem } = useCartStore();
  const hydrated = useHydrated();
  const shown = hydrated ? lines : [];
  const subtotal = cartSubtotal(shown);

  return (
    <div className="container-max px-4 md:px-6 py-10 md:py-14">
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-8">Your Bag</h1>

      {hydrated && shown.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display uppercase text-concrete-600 mb-5">Your bag is empty.</p>
          <Button href="/shop">Start Shopping</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-10">
          <ul className="divide-y divide-concrete-200">
            {shown.map((line) => (
              <li key={line.variantId} className="flex gap-5 py-6">
                <Link href={`/product/${line.slug}`} className="relative w-24 h-28 md:w-28 md:h-32 bg-concrete-100 shrink-0 overflow-hidden">
                  <Image src={line.image} alt={line.name} fill className="object-cover" sizes="112px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${line.slug}`} className="font-display uppercase hover:underline">
                      {line.name}
                    </Link>
                    <button aria-label="Remove item" onClick={() => removeItem(line.variantId)} className="text-concrete-600 hover:text-ink shrink-0">
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <p className="text-sm text-concrete-600 mt-1">{line.color} / {line.size}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-concrete-400">
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-concrete-100" onClick={() => setQty(line.variantId, line.qty - 1)}>
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-display">{line.qty}</span>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-concrete-100" onClick={() => setQty(line.variantId, line.qty + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-display">{formatBDT(line.price * line.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit border border-concrete-200 p-6 space-y-4">
            <div className="flex items-center justify-between font-display uppercase">
              <span>Subtotal</span>
              <span>{formatBDT(subtotal)}</span>
            </div>
            <p className="text-xs text-concrete-600">Shipping calculated at checkout.</p>
            <Button href="/checkout" className="w-full" size="lg">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
