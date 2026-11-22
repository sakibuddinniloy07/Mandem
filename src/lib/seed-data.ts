import raw from "@/data/products.json";
import type { Product, ProductVariant } from "./types";

type RawColor = { name: string; hex: string };
type RawProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  kind: string;
  price: number;
  compareAtPrice?: number;
  isNew?: boolean;
  featured?: boolean;
  description: string;
  details: string[];
  colors: RawColor[];
  sizes: string[];
  images?: string[];
};

// Small deterministic pseudo-random generator so stock counts are stable
// across builds instead of changing on every server restart.
function seededStock(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return 3 + (h % 18); // 3..20
}

function buildVariants(p: RawProduct): ProductVariant[] {
  const variants: ProductVariant[] = [];
  p.colors.forEach((color, ci) => {
    p.sizes.forEach((size, si) => {
      const id = `${p.slug}-${ci}-${si}`;
      variants.push({
        id,
        size,
        color: color.name,
        colorHex: color.hex,
        stock: seededStock(id),
        sku: `MDM-${p.slug.slice(0, 4).toUpperCase()}-${color.name.slice(0, 2).toUpperCase()}-${size}`,
      });
    });
  });
  return variants;
}

export const products: Product[] = (raw as RawProduct[]).map((p, idx) => ({
  id: String(idx + 1),
  slug: p.slug,
  name: p.name,
  categorySlug: p.categorySlug,
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  description: p.description,
  details: p.details,
  // Dummy product photography (Unsplash, free license) where available,
  // falling back to the generated SVG garment art for any product that
  // doesn't have a curated photo mapping yet.
  images: p.images && p.images.length > 0 ? p.images : [`/products/${p.slug}-1.svg`, `/products/${p.slug}-2.svg`],
  variants: buildVariants(p),
  isNew: p.isNew,
  featured: p.featured,
  tags: [p.categorySlug],
}));

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getNewProducts() {
  return products.filter((p) => p.isNew);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function colorsForProduct(product: Product) {
  const seen = new Map<string, string>();
  for (const v of product.variants) {
    if (!seen.has(v.color)) seen.set(v.color, v.colorHex);
  }
  return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
}

export function sizesForProduct(product: Product) {
  const seen: string[] = [];
  for (const v of product.variants) {
    if (!seen.includes(v.size)) seen.push(v.size);
  }
  return seen;
}
