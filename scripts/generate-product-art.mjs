// Generates original, brand-consistent placeholder garment artwork as SVG.
// Flat-vector silhouettes on a soft concrete-toned backdrop matching the
// MANDEM hero (grayscale, architectural light/shadow). No external imagery.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/products");
mkdirSync(OUT_DIR, { recursive: true });

const W = 900;
const H = 1125; // 4:5

function backdrop(seed) {
  // deterministic-ish diagonal light shard like the hero banner
  const shardX = 250 + (seed % 5) * 60;
  return `
    <defs>
      <linearGradient id="bg-${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f3f3f1"/>
        <stop offset="1" stop-color="#dcdcda"/>
      </linearGradient>
      <linearGradient id="shadow-${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#9a9a98"/>
        <stop offset="1" stop-color="#6b6b6a"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg-${seed})"/>
    <polygon points="0,0 ${shardX},0 ${shardX - 420},${H} 0,${H}" fill="url(#shadow-${seed})" opacity="0.55"/>
    <polygon points="${W},0 ${W},${H} ${shardX + 260},${H} ${shardX + 560},0" fill="#2a2a29" opacity="0.08"/>
  `;
}

function watermark() {
  return `
    <text x="${W / 2}" y="${H - 48}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900"
      font-style="italic" font-size="30" letter-spacing="2" fill="#1a1a1a" opacity="0.5">MANDEM</text>
  `;
}

const cx = W / 2;
const cy = H / 2 - 40;

const silhouettes = {
  tee: (fill) => `
    <g transform="translate(${cx} ${cy})">
      <path d="M -150,-210 L -70,-250 C -40,-220 40,-220 70,-250 L 150,-210 L 190,-120 L 120,-85 L 120,230 L -120,230 L -120,-85 L -190,-120 Z"
        fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <path d="M -70,-250 C -40,-220 40,-220 70,-250" fill="none" stroke="#141414" stroke-width="6"/>
    </g>
  `,
  hoodie: (fill) => `
    <g transform="translate(${cx} ${cy})">
      <path d="M -40,-270 C -90,-250 -95,-210 -95,-190 L -170,-150 L -210,-80 L -150,-45 L -140,-150 L -140,250 L 140,250 L 140,-150 L 150,-45 L 210,-80 L 170,-150 L 95,-190 C 95,-210 90,-250 40,-270 C 10,-255 -10,-255 -40,-270 Z"
        fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <path d="M -45,-120 Q 0,-95 45,-120 L 45,-60 Q 0,-35 -45,-60 Z" fill="none" stroke="#141414" stroke-width="5" opacity="0.6"/>
      <rect x="-75" y="60" width="150" height="90" rx="14" fill="none" stroke="#141414" stroke-width="5" opacity="0.6"/>
      <circle cx="-14" cy="-150" r="6" fill="#141414"/>
      <circle cx="14" cy="-150" r="6" fill="#141414"/>
    </g>
  `,
  jacket: (fill) => `
    <g transform="translate(${cx} ${cy})">
      <path d="M -45,-255 L -95,-230 L -185,-190 L -225,-95 L -160,-55 L -150,-150 L -150,255 L 150,255 L 150,-150 L 160,-55 L 225,-95 L 185,-190 L 95,-230 L 45,-255 C 20,-230 -20,-230 -45,-255 Z"
        fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <line x1="0" y1="-210" x2="0" y2="250" stroke="#141414" stroke-width="5" opacity="0.5"/>
      <circle cx="0" cy="-130" r="5" fill="#141414" opacity="0.7"/>
      <circle cx="0" cy="-60" r="5" fill="#141414" opacity="0.7"/>
      <circle cx="0" cy="10" r="5" fill="#141414" opacity="0.7"/>
      <rect x="-145" y="40" width="80" height="55" rx="10" fill="none" stroke="#141414" stroke-width="5" opacity="0.6"/>
      <rect x="65" y="40" width="80" height="55" rx="10" fill="none" stroke="#141414" stroke-width="5" opacity="0.6"/>
    </g>
  `,
  cargo: (fill) => `
    <g transform="translate(${cx} ${cy - 40})">
      <path d="M -120,-230 L 120,-230 L 140,-40 L 95,260 L 25,260 L 10,-20 L -10,-20 L -25,260 L -95,260 L -140,-40 Z"
        fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <rect x="-128" y="-10" width="60" height="75" rx="8" fill="none" stroke="#141414" stroke-width="5" opacity="0.6"/>
      <rect x="68" y="-10" width="60" height="75" rx="8" fill="none" stroke="#141414" stroke-width="5" opacity="0.6"/>
      <line x1="-120" y1="-230" x2="120" y2="-230" stroke="#141414" stroke-width="6"/>
    </g>
  `,
  shorts: (fill) => `
    <g transform="translate(${cx} ${cy - 120})">
      <path d="M -130,-120 L 130,-120 L 150,10 L 90,140 L 25,140 L 10,30 L -10,30 L -25,140 L -90,140 L -150,10 Z"
        fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <line x1="-130" y1="-120" x2="130" y2="-120" stroke="#141414" stroke-width="6"/>
    </g>
  `,
  cap: (fill) => `
    <g transform="translate(${cx} ${cy})">
      <path d="M -150,20 C -150,-110 -80,-180 0,-180 C 80,-180 150,-110 150,20 C 90,45 -90,45 -150,20 Z"
        fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <path d="M -150,20 C -210,35 -230,65 -225,95 L -20,65 C -20,45 -20,30 -20,20 Z" fill="${fill}" stroke="#141414" stroke-width="6" stroke-linejoin="round"/>
      <line x1="0" y1="-180" x2="0" y2="30" stroke="#141414" stroke-width="4" opacity="0.4"/>
    </g>
  `,
};

function svg(kind, fill, seed) {
  const body = silhouettes[kind](fill);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${backdrop(seed)}
    ${body}
    ${watermark()}
  </svg>`;
}

const products = JSON.parse(process.argv[2]);
let seed = 0;
for (const p of products) {
  for (const img of p.images) {
    seed += 1;
    const content = svg(p.kind, img.fill, seed);
    writeFileSync(path.join(OUT_DIR, img.file), content, "utf-8");
  }
}
console.log(`Generated ${seed} product images in ${OUT_DIR}`);
