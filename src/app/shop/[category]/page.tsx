import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/shop/ShopView";
import { products } from "@/lib/seed-data";
import { categories, getCategory } from "@/lib/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return { title: cat ? `${cat.name} — MANDEM` : "Shop — MANDEM" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <div>
      <div className="container-max px-4 md:px-6 pt-8 md:pt-12">
        <h1 className="font-display uppercase text-3xl md:text-5xl tracking-tight">{cat.name}</h1>
        {cat.description && <p className="text-concrete-600 mt-2">{cat.description}</p>}
      </div>
      <ShopView products={products} lockedCategorySlug={cat.slug} />
    </div>
  );
}
