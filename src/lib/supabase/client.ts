"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser Supabase client using the public anon key.
 * Only has access to tables/policies explicitly opened to anon (e.g. live
 * stock reads). All sensitive writes (orders, payments) happen server-side.
 */
export const supabaseBrowser = url && anonKey ? createClient(url, anonKey) : null;
