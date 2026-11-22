import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/categories";
import { getFeaturedProducts, getNewProducts } from "@/lib/seed-data";

export default function Home() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[21/8] overflow-hidden bg-concrete-100">
        <Image
          src="/brand/hero-wide.jpg"
          alt="MANDEM — Men's Apparel, Estd 2K26"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-10 md:pb-16 px-4">
          <Button href="/shop" size="lg" className="shadow-lg">
            Shop The Collection
          </Button>
        </div>
      </section>

      {/* Category strip */}
      <section className="container-max px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="group relative aspect-square bg-ink text-paper flex items-end p-4 overflow-hidden"
            >
              <span className="relative z-10 font-display uppercase text-sm md:text-base tracking-wide group-hover:text-accent transition-colors">
                {c.name}
              </span>
              <span className="absolute inset-0 texture-concrete opacity-30 group-hover:opacity-50 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      <Section title="Best Sellers" subtitle="The pieces that move every drop." viewAllHref="/shop">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      <section className="bg-ink text-paper">
        <div className="container-max px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-[1.05] tracking-tight">
              Built in raw
              <br />
              concrete &amp; hard light.
            </h2>
            <p className="text-concrete-400 mt-5 max-w-md">
              MANDEM is a Dhaka-built menswear label: heavyweight cotton, utility
              detailing and a monochrome palette designed to outlast every season.
            </p>
            <Button href="/shop" variant="outline" className="mt-7">
              Explore The Lookbook
            </Button>
          </div>
          <div className="relative aspect-square">
            <Image
              src="/brand/hero-square.jpg"
              alt="MANDEM brand visual"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <Section title="New Arrivals" subtitle="Fresh off the rack this week." viewAllHref="/shop">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>
    </div>
  );
}
