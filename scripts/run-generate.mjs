import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  readFileSync(path.join(__dirname, "../src/data/products.json"), "utf-8")
);

const jobs = catalog.map((p) => {
  const primary = p.colors[0];
  const secondary = p.colors[1] ?? p.colors[0];
  return {
    kind: p.kind,
    images: [
      { file: `${p.slug}-1.svg`, fill: primary.hex },
      { file: `${p.slug}-2.svg`, fill: secondary.hex },
    ],
  };
});

execFileSync(
  "node",
  [path.join(__dirname, "generate-product-art.mjs"), JSON.stringify(jobs)],
  { stdio: "inherit" }
);
