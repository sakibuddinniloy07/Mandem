import type { Metadata } from "next";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "MANDEM — Men's Apparel",
  description:
    "MANDEM is a men's apparel label out of Dhaka, Bangladesh — heavyweight tees, hoodies, outerwear and bottoms built in raw concrete and hard light. Estd 2K26.",
  // Absolute base for share-preview URLs (og:image etc.). Netlify sets URL to
  // the site's primary address at build time.
  metadataBase: new URL(process.env.URL ?? "https://mandem-ltn6.netlify.app"),
  // The preview image itself comes from app/opengraph-image.jpg.
  openGraph: {
    siteName: "MANDEM",
    type: "website",
    title: "MANDEM — Men's Apparel",
    description:
      "Heavyweight essentials cut in Dhaka, made to be worn hard and worn often.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <CartDrawer />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
