import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] bg-concrete-100 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <Image
          src={product.images[1] ?? product.images[0]}
          alt=""
          aria-hidden
          fill
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
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
      </div>
    </Link>
  );
}
