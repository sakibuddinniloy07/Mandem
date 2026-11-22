import { getSupabaseAdmin } from "./supabase/server";

// Same Supabase-or-in-memory-fallback pattern as orders.ts, stashed on
// globalThis so it's shared across Next.js/Turbopack's separate module
// instances for route handlers vs. page components.
const globalForNewsletter = globalThis as unknown as { __mandemSubscribers?: Set<string> };
const memorySubscribers = globalForNewsletter.__mandemSubscribers ?? new Set<string>();
globalForNewsletter.__mandemSubscribers = memorySubscribers;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = { ok: true; alreadySubscribed: boolean } | { ok: false; error: string };

export async function subscribeToNewsletter(rawEmail: string): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    const { data: existing } = await admin
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existing) return { ok: true, alreadySubscribed: true };

    const { error } = await admin.from("newsletter_subscribers").insert({ email });
    if (error) return { ok: false, error: "Could not subscribe right now. Please try again." };
    return { ok: true, alreadySubscribed: false };
  }

  if (memorySubscribers.has(email)) return { ok: true, alreadySubscribed: true };
  memorySubscribers.add(email);
  return { ok: true, alreadySubscribed: false };
}
