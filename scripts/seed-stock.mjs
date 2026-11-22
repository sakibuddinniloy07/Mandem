// Seeds the `product_stock` table in Supabase from src/data/products.json.
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-stock.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  process.exit(1);
}

const catalog = JSON.parse(
  readFileSync(path.join(__dirname, "../src/data/products.json"), "utf-8")
);

function seededStock(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return 3 + (h % 18);
}

const rows = [];
for (const p of catalog) {
  p.colors.forEach((color, ci) => {
    p.sizes.forEach((size, si) => {
      const id = `${p.slug}-${ci}-${si}`;
      rows.push({
        sku: `MDM-${p.slug.slice(0, 4).toUpperCase()}-${color.name.slice(0, 2).toUpperCase()}-${size}`,
        product_slug: p.slug,
        size,
        color: color.name,
        stock: seededStock(id),
      });
    });
  });
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error, count } = await supabase
  .from("product_stock")
  .upsert(rows, { onConflict: "sku", count: "exact" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log(`Seeded/updated ${rows.length} SKUs in product_stock (reported count: ${count}).`);
