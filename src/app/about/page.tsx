import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us — MANDEM",
};

export default function AboutPage() {
  return (
    <div className="container-max px-4 md:px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="relative aspect-square bg-concrete-100">
        <Image
          src="/brand/hero-square.jpg"
          alt="MANDEM wordmark on a concrete wall"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div>
        <p className="font-display uppercase text-xs tracking-widest text-concrete-600">
          Men&apos;s Apparel · Estd 2K26
        </p>
        <h1 className="font-display uppercase text-3xl md:text-5xl leading-[1.05] tracking-tight mt-3">
          Built in raw concrete &amp; hard light.
        </h1>
        <p className="text-concrete-800 mt-6 max-w-md leading-relaxed">
          MANDEM is a Dhaka-built menswear label: heavyweight cotton, utility detailing and a
          monochrome palette designed to outlast every season.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Button href="/shop">Shop All Products</Button>
          <Button href="/contact" variant="secondary">
            Get In Touch
          </Button>
        </div>
      </div>
    </div>
  );
}
