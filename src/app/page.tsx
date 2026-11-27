import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { getFeaturedProducts } from "@/lib/seed-data";

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <Hero />

      <Section title="Best Sellers" subtitle="The pieces that move every drop." viewAllHref="/shop">
        <Reveal stagger={0.06} className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Reveal>
      </Section>

      <section className="bg-ink text-paper">
        <div className="container-max px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
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
          <Reveal delay={0.15} className="relative aspect-square w-full max-w-[420px] mx-auto md:mx-0 md:justify-self-center">
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

      <NewsletterSignup />
    </div>
  );
}
