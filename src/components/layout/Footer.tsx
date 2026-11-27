import Link from "next/link";
import { categories } from "@/lib/categories";
import { CopyrightYear } from "./CopyrightYear";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-max px-4 md:px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <span className="font-display italic font-black text-3xl">MANDEM</span>
          <p className="text-concrete-400 text-sm mt-3 max-w-xs">
            Men&apos;s apparel built in raw concrete, hard light and heavyweight cotton.
            Estd 2K26 &mdash; Dhaka, Bangladesh.
          </p>
          <SocialIcons className="mt-6" />
        </div>
        <div>
          <p className="font-display uppercase text-xs tracking-widest text-concrete-400 mb-4">Shop</p>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display uppercase text-xs tracking-widest text-concrete-400 mb-4">Support</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/orders" className="hover:text-accent">Track Order</Link></li>
            <li><Link href="/shipping-returns" className="hover:text-accent">Shipping &amp; Returns</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact Us</Link></li>
            <li><Link href="/size-guide" className="hover:text-accent">Size Guide</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display uppercase text-xs tracking-widest text-concrete-400 mb-4">Get in touch</p>
          <ul className="space-y-2.5 text-sm text-concrete-400">
            <li>hello@mandem.com.bd</li>
            <li>+880 1XXX-XXXXXX</li>
            <li>Uttara, Dhaka, Bangladesh</li>
          </ul>
          <div className="flex gap-3 mt-4 font-display text-xs uppercase tracking-wide">
            <span className="border border-concrete-800 px-2 py-1">bKash</span>
            <span className="border border-concrete-800 px-2 py-1">Cash on Delivery</span>
          </div>
        </div>
      </div>
      <div className="border-t border-concrete-800 py-5 text-center text-xs text-concrete-600 font-display uppercase tracking-wide">
        © <CopyrightYear /> MANDEM. All rights reserved.
      </div>
    </footer>
  );
}
