export const FREE_SHIPPING_THRESHOLD = 2500;
export const DHAKA_SHIPPING_FEE = 60;
export const OUTSIDE_DHAKA_SHIPPING_FEE = 120;

export function calculateShipping(subtotal: number, division: string) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return division === "Dhaka" ? DHAKA_SHIPPING_FEE : OUTSIDE_DHAKA_SHIPPING_FEE;
}

export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];
