import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";
import { Hero } from "@/components/home/Hero";
import { CategoryTile } from "@/components/home/CategoryTile";
import { Reveal } from "@/components/motion/Reveal";
import { categories } from "@/lib/categories";
import { getFeaturedProducts, getNewProducts, getProductsByCategory } from "@/lib/seed-data";

export default function Home() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewProducts();
  const categoryImage = (slug: string) => getProductsByCategory(slug)[0]?.images[0];

  return (
    <div>
      {/* Hero */}
      <Hero
        promo={
          newArrivals[0] && {
            slug: newArrivals[0].slug,
            name: newArrivals[0].name,
            price: newArrivals[0].price,
            image: newArrivals[0].images[0],
          }
        }
      />

      {/* Category strip */}
      <section className="container-max px-4 md:px-6 py-10 md:py-14">
        <Reveal stagger={0.08} className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {categories.map((c) => (
            <CategoryTile key={c.slug} slug={c.slug} name={c.name} image={categoryImage(c.slug)} />
          ))}
        </Reveal>
      </section>

      <Section title="Best Sellers" subtitle="The pieces that move every drop." viewAllHref="/shop">
        <Reveal stagger={0.06} className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Reveal>
      </Section>

      <section className="bg-ink text-paper">
        <div className="container-max px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <Reveal>
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
          </Reveal>
          <Reveal delay={0.15} className="relative aspect-square">
            <Image
              src="/brand/hero-square.jpg"
              alt="MANDEM brand visual"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      <Section title="New Arrivals" subtitle="Fresh off the rack this week." viewAllHref="/shop">
        <Reveal stagger={0.06} className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Reveal>
      </Section>

      <NewsletterSignup />
    </div>
  );
}
