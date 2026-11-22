import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase/server";
import { generateOrderNumber } from "./format";
import { calculateShipping } from "./shipping";
import type { Address, CartLine, Order, OrderStatus } from "./types";
import { getProductBySlug } from "./seed-data";

// In-memory fallback store, used only when Supabase isn't configured yet.
// This keeps the storefront fully clickable end-to-end out of the box, but
// orders won't survive a server restart or work across multiple instances —
// connect Supabase (see supabase/schema.sql) for real persistence.
//
// Stashed on `globalThis` rather than a plain module-level variable: Next.js
// (dev Turbopack especially) can give route handlers and page/server
// components separate instances of a module, which would otherwise mean an
// order created via POST /api/orders is invisible to the very next page
// render looking it up. globalThis is shared for the whole Node process.
const globalForOrders = globalThis as unknown as { __mandemOrders?: Map<string, Order> };
const memoryOrders = globalForOrders.__mandemOrders ?? new Map<string, Order>();
globalForOrders.__mandemOrders = memoryOrders;

export type CreateOrderInput = {
  lines: CartLine[];
  address: Address;
  paymentMethod: "bkash" | "cod";
};

export type CreateOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (input.lines.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }

  // Re-price server-side from the known catalog; never trust client prices.
  let subtotal = 0;
  const verifiedLines: CartLine[] = [];
  for (const line of input.lines) {
    const product = getProductBySlug(line.slug);
    if (!product) return { ok: false, error: `Unknown product: ${line.slug}` };
    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant) return { ok: false, error: `Unknown variant for ${product.name}` };
    const qty = Math.max(1, Math.min(line.qty, 20));
    subtotal += product.price * qty;
    verifiedLines.push({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      qty,
    });
  }

  const shippingFee = calculateShipping(subtotal, input.address.division);
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();
  const status: OrderStatus = input.paymentMethod === "cod" ? "processing" : "pending_payment";

  const admin = getSupabaseAdmin();

  if (admin) {
    const { data: orderRow, error: orderErr } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        status,
        payment_method: input.paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        total,
        customer_name: input.address.fullName,
        customer_phone: input.address.phone,
        customer_email: input.address.email ?? null,
        division: input.address.division,
        district: input.address.district,
        address_line: input.address.addressLine,
        notes: input.address.notes ?? null,
      })
      .select()
      .single();

    if (orderErr || !orderRow) {
      return { ok: false, error: orderErr?.message ?? "Could not create order." };
    }

    const itemRows = verifiedLines.map((l) => ({
      order_id: orderRow.id,
      product_slug: l.slug,
      variant_sku:
        getProductBySlug(l.slug)?.variants.find((v) => v.id === l.variantId)?.sku ?? l.variantId,
      product_name: l.name,
      size: l.size,
      color: l.color,
      unit_price: l.price,
      qty: l.qty,
    }));
    const { error: itemsErr } = await admin.from("order_items").insert(itemRows);
    if (itemsErr) {
      return { ok: false, error: itemsErr.message };
    }

    // Cash on Delivery orders decrement stock immediately; bKash orders
    // decrement on successful payment execution (see /api/payments/bkash/callback).
    if (input.paymentMethod === "cod") {
      for (const row of itemRows) {
        await admin.rpc("decrement_stock", { p_sku: row.variant_sku, p_qty: row.qty });
      }
    }

    const order: Order = {
      id: orderRow.id,
      orderNumber: orderRow.order_number,
      items: verifiedLines,
      subtotal,
      shippingFee,
      total,
      address: input.address,
      status: orderRow.status,
      paymentMethod: input.paymentMethod,
      createdAt: orderRow.created_at,
    };
    return { ok: true, order };
  }

  // Fallback: no Supabase configured, keep the order in memory for this demo session.
  const order: Order = {
    id: orderNumber,
    orderNumber,
    items: verifiedLines,
    subtotal,
    shippingFee,
    total,
    address: input.address,
    status,
    paymentMethod: input.paymentMethod,
    createdAt: new Date().toISOString(),
  };
  memoryOrders.set(orderNumber, order);
  return { ok: true, order };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data: orderRow } = await admin
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (!orderRow) return null;
    const { data: itemRows } = await admin
      .from("order_items")
      .select("*")
      .eq("order_id", orderRow.id);
    return {
      id: orderRow.id,
      orderNumber: orderRow.order_number,
      items: (itemRows ?? []).map((r) => ({
        productId: r.product_slug,
        variantId: r.variant_sku,
        slug: r.product_slug,
        name: r.product_name,
        price: r.unit_price,
        image: getProductBySlug(r.product_slug)?.images[0] ?? "/products/placeholder.svg",
        size: r.size,
        color: r.color,
        qty: r.qty,
      })),
      subtotal: orderRow.subtotal,
      shippingFee: orderRow.shipping_fee,
      total: orderRow.total,
      address: {
        fullName: orderRow.customer_name,
        phone: orderRow.customer_phone,
        email: orderRow.customer_email ?? undefined,
        division: orderRow.division,
        district: orderRow.district,
        addressLine: orderRow.address_line,
        notes: orderRow.notes ?? undefined,
      },
      status: orderRow.status,
      paymentMethod: orderRow.payment_method,
      bkashPaymentId: orderRow.bkash_payment_id ?? undefined,
      bkashTrxId: orderRow.bkash_trx_id ?? undefined,
      createdAt: orderRow.created_at,
    };
  }
  return memoryOrders.get(orderNumber) ?? null;
}

export async function getOrderByBkashPaymentId(paymentID: string): Promise<Order | null> {
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data: orderRow } = await admin
      .from("orders")
      .select("order_number")
      .eq("bkash_payment_id", paymentID)
      .maybeSingle();
    if (!orderRow) return null;
    return getOrderByNumber(orderRow.order_number);
  }
  for (const order of memoryOrders.values()) {
    if (order.bkashPaymentId === paymentID) return order;
  }
  return null;
}

export async function updateOrderPayment(
  orderNumber: string,
  update: Partial<Pick<Order, "status" | "bkashPaymentId" | "bkashTrxId">>
) {
  const admin = getSupabaseAdmin();
  if (admin) {
    await admin
      .from("orders")
      .update({
        status: update.status,
        bkash_payment_id: update.bkashPaymentId,
        bkash_trx_id: update.bkashTrxId,
      })
      .eq("order_number", orderNumber);
    return;
  }
  const existing = memoryOrders.get(orderNumber);
  if (existing) memoryOrders.set(orderNumber, { ...existing, ...update });
}

export async function getOrderItemsForStockDecrement(orderNumber: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const { data: orderRow } = await admin
    .from("orders")
    .select("id")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!orderRow) return [];
  const { data: itemRows } = await admin
    .from("order_items")
    .select("variant_sku, qty")
    .eq("order_id", orderRow.id);
  return itemRows ?? [];
}

export { isSupabaseConfigured };
