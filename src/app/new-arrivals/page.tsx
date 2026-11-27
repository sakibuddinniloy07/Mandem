import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";
import { getNewProducts } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "New Arrivals — MANDEM",
};

export default function NewArrivalsPage() {
  return (
    <div>
      <div className="container-max px-4 md:px-6 pt-8 md:pt-12">
        <h1 className="font-display uppercase text-3xl md:text-5xl tracking-tight">New Arrivals</h1>
        <p className="text-concrete-600 mt-2">Fresh off the rack this week.</p>
      </div>
      <ShopView products={getNewProducts()} />
    </div>
  );
}
