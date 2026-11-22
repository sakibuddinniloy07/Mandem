// Hardcoded promo codes. Discounts are always computed server-side from the
// verified subtotal in createOrder — the client never sends a discount
// amount, only the code it typed, so a tampered request can't apply a
// bigger discount than the code actually allows.

export type PromoCode = {
  code: string;
  label: string;
  // Percentage off the merchandise subtotal (0-100), applied before shipping.
  percentOff: number;
  minSubtotal?: number;
};

const PROMO_CODES: PromoCode[] = [
  { code: "MANDEM10", label: "10% off your order", percentOff: 10 },
  { code: "WELCOME15", label: "15% off for new customers", percentOff: 15, minSubtotal: 1500 },
];

export function findPromoCode(rawCode: string | null | undefined): PromoCode | null {
  if (!rawCode) return null;
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) return null;
  return PROMO_CODES.find((p) => p.code === normalized) ?? null;
}

export function calculateDiscount(subtotal: number, rawCode: string | null | undefined) {
  const trimmed = rawCode?.trim();
  if (!trimmed) {
    return { discount: 0, promo: null as PromoCode | null, error: null as string | null };
  }
  const promo = findPromoCode(trimmed);
  if (!promo) {
    return { discount: 0, promo: null as PromoCode | null, error: "That promo code isn't valid." };
  }
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return {
      discount: 0,
      promo: null,
      error: `${promo.code} requires a minimum order of ৳${promo.minSubtotal}.`,
    };
  }
  const discount = Math.round(subtotal * (promo.percentOff / 100));
  return { discount, promo, error: null };
}
