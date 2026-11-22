export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number; // in BDT (poisha-free integer taka)
  compareAtPrice?: number;
  description: string;
  details: string[];
  images: string[];
  variants: ProductVariant[];
  tags?: string[];
  isNew?: boolean;
  featured?: boolean;
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

export type Address = {
  fullName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  addressLine: string;
  notes?: string;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export type Order = {
  id: string;
  orderNumber: string;
  items: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  address: Address;
  status: OrderStatus;
  paymentMethod: "bkash" | "cod";
  bkashPaymentId?: string;
  bkashTrxId?: string;
  createdAt: string;
};
