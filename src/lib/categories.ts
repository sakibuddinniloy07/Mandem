import type { Category } from "./types";

export const categories: Category[] = [
  { id: "tees", slug: "tees", name: "Tees", description: "Heavyweight cotton tees cut oversized and clean." },
  { id: "hoodies", slug: "hoodies", name: "Hoodies", description: "Brushed fleece pullovers and zip hoodies." },
  { id: "outerwear", slug: "outerwear", name: "Outerwear", description: "Bombers, overshirts and field jackets." },
  { id: "bottoms", slug: "bottoms", name: "Bottoms", description: "Cargos, denim, joggers and shorts." },
  { id: "headwear", slug: "headwear", name: "Headwear", description: "Structured and unstructured caps." },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
