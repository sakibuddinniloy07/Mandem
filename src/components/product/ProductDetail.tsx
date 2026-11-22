"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { colorsForProduct, sizesForProduct } from "@/lib/seed-data";
import { formatBDT } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/Button";

export function ProductDetail({ product }: { product: Product }) {
  const colors = useMemo(() => colorsForProduct(product), [product]);
  const sizes = useMemo(() => sizesForProduct(product), [product]);
  const [color, setColor] = useState(colors[0]?.name);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  function handleAdd() {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    if (!variant || variant.stock < 1) {
      setError("That size/color is currently out of stock.");
      return;
    }
    setError(null);
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQty(1);
  }

  return (
    <div>
      <h1 className="font-display uppercase text-2xl md:text-4xl tracking-tight">{product.name}</h1>
      <div className="flex items-center gap-3 mt-2">
        <span className="font-display text-xl">{formatBDT(product.price)}</span>
        {onSale && (
          <span className="font-display text-base text-concrete-600 line-through">
            {formatBDT(product.compareAtPrice!)}
          </span>
        )}
      </div>
      <p className="text-concrete-800 mt-5 leading-relaxed">{product.description}</p>

      <div className="mt-7">
        <p className="font-display uppercase text-xs tracking-widest text-concrete-600 mb-2.5">
          Color: <span className="text-ink">{color}</span>
        </p>
        <div className="flex gap-2.5">
          {colors.map((c) => (
            <button
              key={c.name}
              aria-label={c.name}
              onClick={() => setColor(c.name)}
              className={clsx(
                "w-9 h-9 rounded-full border-2 flex items-center justify-center",
                color === c.name ? "border-ink" : "border-transparent"
              )}
            >
              <span
                className="w-7 h-7 rounded-full border border-concrete-400"
                style={{ backgroundColor: c.hex }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <p className="font-display uppercase text-xs tracking-widest text-concrete-600">Size</p>
          <a href="/size-guide" className="text-xs underline underline-offset-4 text-concrete-600">
            Size Guide
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const v = product.variants.find((pv) => pv.color === color && pv.size === s);
            const outOfStock = !v || v.stock < 1;
            return (
              <button
                key={s}
                disabled={outOfStock}
                onClick={() => setSize(s)}
                className={clsx(
                  "min-w-11 px-3 py-2.5 text-sm font-display border",
                  size === s ? "bg-ink text-paper border-ink" : "border-concrete-400 hover:border-ink",
                  outOfStock && "opacity-30 line-through pointer-events-none"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        {variant && variant.stock <= 5 && (
          <p className="text-xs text-concrete-600 mt-2">Only {variant.stock} left in this size.</p>
        )}
      </div>

      <div className="mt-7 flex items-center gap-4">
        <div className="flex items-center border border-concrete-400">
          <button
            aria-label="Decrease quantity"
            className="w-10 h-11 flex items-center justify-center hover:bg-concrete-100"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center font-display">{qty}</span>
          <button
            aria-label="Increase quantity"
            className="w-10 h-11 flex items-center justify-center hover:bg-concrete-100"
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
        <Button onClick={handleAdd} className="flex-1" size="lg">
          {added ? (
            <>
              <Check size={16} /> Added
            </>
          ) : (
            "Add To Bag"
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-700 mt-2">{error}</p>}

      <div className="mt-7 grid grid-cols-3 gap-2 border-t border-b border-concrete-200 py-5 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <Truck size={18} />
          <span className="text-[11px] text-concrete-700 leading-tight">
            Free delivery over ৳2,500
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <RotateCcw size={18} />
          <span className="text-[11px] text-concrete-700 leading-tight">7-day exchange</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ShieldCheck size={18} />
          <span className="text-[11px] text-concrete-700 leading-tight">bKash &amp; COD</span>
        </div>
      </div>

      <details className="mt-10 border-t border-concrete-200 pt-5">
        <summary className="font-display uppercase text-sm tracking-wide cursor-pointer">
          Product Details
        </summary>
        <ul className="mt-3 space-y-1.5 text-sm text-concrete-800 list-disc list-inside">
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </details>
      <details className="border-t border-concrete-200 pt-5 mt-4">
        <summary className="font-display uppercase text-sm tracking-wide cursor-pointer">
          Shipping &amp; Returns
        </summary>
        <p className="mt-3 text-sm text-concrete-800 leading-relaxed">
          Delivery across Bangladesh in 2&ndash;5 business days. Pay with bKash or Cash on
          Delivery. Unworn items with tags can be exchanged within 7 days of delivery.
        </p>
      </details>
    </div>
  );
}
