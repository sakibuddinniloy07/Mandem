"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/types";
import { categories } from "@/lib/categories";
import { ProductCard } from "@/components/product/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "newest";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "One Size"];

export function ShopView({
  products,
  lockedCategorySlug,
}: {
  products: Product[];
  lockedCategorySlug?: string;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categorySlugs, setCategorySlugs] = useState<string[]>(
    lockedCategorySlug ? [lockedCategorySlug] : []
  );
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("featured");

  const availableSizes = useMemo(() => {
    const present = new Set<string>();
    for (const p of products) for (const v of p.variants) present.add(v.size);
    return ALL_SIZES.filter((s) => present.has(s));
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (categorySlugs.length && !categorySlugs.includes(p.categorySlug)) return false;
      if (sizes.length && !p.variants.some((v) => sizes.includes(v.size))) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, categorySlugs, sizes, sort]);

  function toggleCategory(slug: string) {
    setCategorySlugs((cur) => (cur.includes(slug) ? cur.filter((c) => c !== slug) : [...cur, slug]));
  }
  function toggleSize(size: string) {
    setSizes((cur) => (cur.includes(size) ? cur.filter((s) => s !== size) : [...cur, size]));
  }
  function clearAll() {
    setCategorySlugs(lockedCategorySlug ? [lockedCategorySlug] : []);
    setSizes([]);
  }

  const activeCount = (lockedCategorySlug ? categorySlugs.length - 1 : categorySlugs.length) + sizes.length;

  const filterPanel = (
    <div className="space-y-8">
      {!lockedCategorySlug && (
        <div>
          <p className="font-display uppercase text-xs tracking-widest text-concrete-600 mb-3">Category</p>
          <ul className="space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-ink"
                    checked={categorySlugs.includes(c.slug)}
                    onChange={() => toggleCategory(c.slug)}
                  />
                  {c.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="font-display uppercase text-xs tracking-widest text-concrete-600 mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={clsx(
                "border px-3 py-1.5 text-xs font-display",
                sizes.includes(s) ? "bg-ink text-paper border-ink" : "border-concrete-400 hover:border-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {activeCount > 0 && (
        <button onClick={clearAll} className="text-xs underline underline-offset-4 text-concrete-600">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-max px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <p className="text-sm text-concrete-600">{filtered.length} products</p>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-concrete-400 bg-paper text-xs md:text-sm font-display uppercase px-3 py-2"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button
            onClick={() => setFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 border border-concrete-400 px-3 py-2 text-xs font-display uppercase"
          >
            <SlidersHorizontal size={14} />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden md:block">{filterPanel}</aside>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-concrete-600 font-display uppercase">
            No products match these filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-50 md:hidden transition-opacity",
          filtersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
        <div
          className={clsx(
            "absolute right-0 top-0 h-full w-[85%] max-w-xs bg-paper p-5 overflow-y-auto transition-transform duration-300",
            filtersOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-display uppercase text-lg">Filters</span>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X size={22} />
            </button>
          </div>
          {filterPanel}
          <button
            onClick={() => setFiltersOpen(false)}
            className="mt-8 w-full bg-ink text-paper font-display uppercase text-sm py-3"
          >
            Show {filtered.length} Results
          </button>
        </div>
      </div>
    </div>
  );
}
