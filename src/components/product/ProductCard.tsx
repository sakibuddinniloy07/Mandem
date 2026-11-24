"use client";

import { useRef, type Ref } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { colorsForProduct } from "@/lib/seed-data";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const colors = colorsForProduct(product);

  const cardRef = useRef<HTMLAnchorElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLDivElement>(null);
  const imgBRef = useRef<HTMLDivElement>(null);

  function handleEnter() {
    if (prefersReducedMotion()) return;
    gsap.to(cardRef.current, { y: -6, duration: 0.3, ease: "power2.out" });
    gsap.to(zoomRef.current, { scale: 1.06, duration: 0.6, ease: "power3.out" });
    gsap.to(imgBRef.current, { opacity: 1, duration: 0.35 });
    gsap.to(imgARef.current, { opacity: 0, duration: 0.35 });
  }

  function handleLeave() {
    if (prefersReducedMotion()) return;
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
    gsap.to(zoomRef.current, { scale: 1, duration: 0.6, ease: "power3.out" });
    gsap.to(imgBRef.current, { opacity: 0, duration: 0.35 });
    gsap.to(imgARef.current, { opacity: 1, duration: 0.35 });
  }

  return (
    <Link
      ref={cardRef as Ref<HTMLAnchorElement>}
      href={`/product/${product.slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-concrete-100 overflow-hidden">
        <div ref={zoomRef} className="absolute inset-0">
          <div ref={imgARef} className="absolute inset-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div ref={imgBRef} className="absolute inset-0 opacity-0">
            <Image
              src={product.images[1] ?? product.images[0]}
              alt=""
              aria-hidden
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="dark">New</Badge>}
          {onSale && <Badge tone="accent">Sale</Badge>}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-display uppercase text-sm md:text-[15px] leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-display text-sm">{formatBDT(product.price)}</span>
          {onSale && (
            <span className="font-display text-xs text-concrete-600 line-through">
              {formatBDT(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3 h-3 rounded-full border border-concrete-400"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
