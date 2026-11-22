"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatBDT } from "@/lib/format";
import { BANGLADESH_DIVISIONS, calculateShipping } from "@/lib/shipping";
import { calculateDiscount } from "@/lib/promo";
import { Button } from "@/components/ui/Button";
import type { Address } from "@/lib/types";

type PaymentMethod = "bkash" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCartStore();
  const hydrated = useHydrated();
  const shown = hydrated ? lines : [];
  const subtotal = cartSubtotal(shown);

  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    email: "",
    division: "Dhaka",
    district: "",
    addressLine: "",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("bkash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const shippingFee = useMemo(() => calculateShipping(subtotal, address.division), [subtotal, address.division]);
  const { discount } = useMemo(() => calculateDiscount(subtotal, appliedPromo), [subtotal, appliedPromo]);
  const total = Math.max(0, subtotal - discount) + shippingFee;

  function handleApplyPromo() {
    const { discount: d, promo, error: err } = calculateDiscount(subtotal, promoInput);
    if (err) {
      setPromoError(err);
      setAppliedPromo(null);
      return;
    }
    if (!promo || d === 0) {
      setPromoError("That promo code isn't valid.");
      setAppliedPromo(null);
      return;
    }
    setPromoError(null);
    setAppliedPromo(promo.code);
  }

  function updateField<K extends keyof Address>(key: K, value: Address[K]) {
    setAddress((a) => ({ ...a, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (shown.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: shown,
          address,
          paymentMethod: payment,
          promoCode: appliedPromo ?? undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      if (payment === "cod") {
        clear();
        router.push(`/checkout/success?order=${data.order.orderNumber}`);
        return;
      }

      const bkashRes = await fetch("/api/payments/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: data.order.orderNumber }),
      });
      const bkashData = await bkashRes.json();
      if (!bkashData.ok) {
        setError(bkashData.error ?? "Could not start bKash payment.");
        setSubmitting(false);
        return;
      }
      clear();
      window.location.href = bkashData.bkashURL;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (hydrated && shown.length === 0) {
    return (
      <div className="container-max px-4 md:px-6 py-24 text-center">
        <p className="font-display uppercase text-concrete-600 mb-5">Your bag is empty.</p>
        <Button href="/shop">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container-max px-4 md:px-6 py-10 md:py-14">
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          <div>
            <h2 className="font-display uppercase text-sm tracking-widest text-concrete-600 mb-4">
              Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input
                  required
                  value={address.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="input"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Mobile Number" required>
                <input
                  required
                  type="tel"
                  value={address.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="input"
                  placeholder="01XXXXXXXXX"
                />
              </Field>
              <Field label="Email (optional)" className="sm:col-span-2">
                <input
                  type="email"
                  value={address.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Division" required>
                <select
                  required
                  value={address.division}
                  onChange={(e) => updateField("division", e.target.value)}
                  className="input"
                >
                  {BANGLADESH_DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="District / City" required>
                <input
                  required
                  value={address.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  className="input"
                  placeholder="e.g. Uttara, Dhaka"
                />
              </Field>
              <Field label="Full Address" required className="sm:col-span-2">
                <textarea
                  required
                  value={address.addressLine}
                  onChange={(e) => updateField("addressLine", e.target.value)}
                  className="input min-h-24"
                  placeholder="House, road, area, landmark"
                />
              </Field>
              <Field label="Order Notes (optional)" className="sm:col-span-2">
                <textarea
                  value={address.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="input min-h-16"
                  placeholder="Delivery instructions, etc."
                />
              </Field>
            </div>
          </div>

          <div>
            <h2 className="font-display uppercase text-sm tracking-widest text-concrete-600 mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 border border-concrete-400 px-4 py-3.5 cursor-pointer has-[:checked]:border-ink">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "bkash"}
                  onChange={() => setPayment("bkash")}
                  className="accent-ink"
                />
                <span className="font-display uppercase text-sm">Pay with bKash</span>
                <span className="ml-auto text-xs text-concrete-600">Instant, secure</span>
              </label>
              <label className="flex items-center gap-3 border border-concrete-400 px-4 py-3.5 cursor-pointer has-[:checked]:border-ink">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                  className="accent-ink"
                />
                <span className="font-display uppercase text-sm">Cash on Delivery</span>
                <span className="ml-auto text-xs text-concrete-600">Pay when it arrives</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" size="lg" className="w-full md:hidden" disabled={submitting}>
            {submitting ? "Processing..." : payment === "bkash" ? "Pay with bKash" : "Place Order"}
          </Button>
        </div>

        <div className="h-fit border border-concrete-200 p-6 space-y-5">
          <h2 className="font-display uppercase text-sm tracking-widest text-concrete-600">Order Summary</h2>
          <ul className="space-y-4 max-h-64 overflow-y-auto">
            {shown.map((l) => (
              <li key={l.variantId} className="flex gap-3">
                <div className="relative w-14 h-16 bg-concrete-100 shrink-0 overflow-hidden">
                  <Image src={l.image} alt={l.name} fill className="object-cover" sizes="56px" />
                  <span className="absolute -top-1.5 -right-1.5 bg-ink text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {l.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display uppercase text-xs leading-tight">{l.name}</p>
                  <p className="text-[11px] text-concrete-600">{l.color} / {l.size}</p>
                </div>
                <span className="text-xs font-display shrink-0">{formatBDT(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div>
            <label className="block text-xs font-display uppercase tracking-wide text-concrete-600 mb-1.5">
              Promo Code
            </label>
            {appliedPromo ? (
              <div className="flex items-center justify-between border border-ink px-3 py-2.5 text-sm">
                <span className="font-display uppercase">{appliedPromo} applied</span>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoInput("");
                  }}
                  className="text-xs underline underline-offset-4 text-concrete-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError(null);
                  }}
                  className="input flex-1"
                  placeholder="Enter code"
                />
                <Button type="button" variant="secondary" onClick={handleApplyPromo}>
                  Apply
                </Button>
              </div>
            )}
            {promoError && <p className="text-xs text-red-700 mt-1.5">{promoError}</p>}
          </div>

          <div className="border-t border-concrete-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-concrete-600">Subtotal</span>
              <span>{formatBDT(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-concrete-600">Discount ({appliedPromo})</span>
                <span>-{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-concrete-600">Shipping</span>
              <span>{shippingFee === 0 ? "Free" : formatBDT(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-display text-base pt-2 border-t border-concrete-200">
              <span>Total</span>
              <span>{formatBDT(total)}</span>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full hidden md:flex" disabled={submitting}>
            {submitting ? "Processing..." : payment === "bkash" ? "Pay with bKash" : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs font-display uppercase tracking-wide text-concrete-600 mb-1.5">
        {label} {required && <span className="text-red-700">*</span>}
      </span>
      {children}
    </label>
  );
}
