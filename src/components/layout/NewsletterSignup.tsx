"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <section className="border-t border-concrete-200">
      <Reveal className="container-max px-4 md:px-6 py-14 md:py-20 text-center max-w-xl mx-auto">
        <h2 className="font-display uppercase text-2xl md:text-3xl tracking-tight">Join The List</h2>
        <p className="text-concrete-600 mt-3">
          New drops, restocks and early access — straight to your inbox. No spam.
        </p>
        {status === "done" ? (
          <p className="font-display uppercase text-sm mt-6">You&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input flex-1"
            />
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Joining..." : "Subscribe"}
            </Button>
          </form>
        )}
        {error && <p className="text-sm text-red-700 mt-3">{error}</p>}
      </Reveal>
    </section>
  );
}
