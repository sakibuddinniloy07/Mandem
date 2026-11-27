import { SocialIcons } from "@/components/ui/SocialIcons";

export const metadata = { title: "Contact — MANDEM" };

export default function ContactPage() {
  return (
    <div className="container-max px-4 md:px-6 py-12 md:py-16 max-w-xl mx-auto text-center">
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-4">Get In Touch</h1>
      <p className="text-concrete-600 mb-8">
        Questions about an order, sizing, or a collab? Reach us directly.
      </p>
      <div className="space-y-3 font-display uppercase text-sm">
        <p>hello@mandem.com.bd</p>
        <p>+880 1XXX-XXXXXX</p>
        <p>Uttara, Dhaka, Bangladesh</p>
      </div>
      <SocialIcons size={24} className="justify-center gap-6 mt-8" />
    </div>
  );
}
