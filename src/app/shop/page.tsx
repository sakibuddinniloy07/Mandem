import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";
import { products } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Shop All — MANDEM",
};

export default function ShopPage() {
  return (
    <div>
      <div className="container-max px-4 md:px-6 pt-8 md:pt-12">
        <h1 className="font-display uppercase text-3xl md:text-5xl tracking-tight">All Products</h1>
      </div>
      <ShopView products={products} />
    </div>
  );
}
