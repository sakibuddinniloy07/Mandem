"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatBDT } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import type { Order } from "@/lib/types";

function OrderLookup() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(num: string, ph: string) {
    if (!num || !ph) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(num)}?phone=${encodeURIComponent(ph)}`);
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Order not found.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialOrder = searchParams.get("order");
    const initialPhone = searchParams.get("phone");
    if (initialOrder && initialPhone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial deep-link lookup on mount
      lookup(initialOrder, initialPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-max px-4 md:px-6 py-10 md:py-16 max-w-xl mx-auto">
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-2">Track Your Order</h1>
      <p className="text-concrete-600 mb-8">
        Enter your order number and the mobile number used at checkout.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(orderNumber, phone);
        }}
        className="space-y-4 mb-10"
      >
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number (e.g. MDM261122-4821)"
          className="input"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile Number"
          className="input"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Searching..." : "Track Order"}
        </Button>
      </form>

      {error && <p className="text-sm text-red-700 mb-6">{error}</p>}

      {order && (
        <div className="border border-concrete-200 p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-display uppercase text-lg">#{order.orderNumber}</p>
              <p className="text-xs text-concrete-600 mt-1">
                Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <span className="font-display uppercase text-xs border border-ink px-2.5 py-1 shrink-0">
              {order.status.replace("_", " ")}
            </span>
          </div>

          <ul className="divide-y divide-concrete-100">
            {order.items.map((l) => (
              <li key={l.variantId} className="flex gap-3 py-3">
                <div className="relative w-14 h-16 bg-concrete-100 shrink-0 overflow-hidden">
                  <Image src={l.image} alt={l.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display uppercase text-xs">{l.name}</p>
                  <p className="text-[11px] text-concrete-600">{l.color} / {l.size} &times; {l.qty}</p>
                </div>
                <span className="text-xs font-display shrink-0">{formatBDT(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-concrete-200 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-concrete-600">Subtotal</span>
              <span>{formatBDT(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-concrete-600">Shipping</span>
              <span>{order.shippingFee === 0 ? "Free" : formatBDT(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-display text-base pt-2 border-t border-concrete-200">
              <span>Total</span>
              <span>{formatBDT(order.total)}</span>
            </div>
          </div>

          <div className="text-sm text-concrete-800">
            <p className="font-display uppercase text-xs tracking-widest text-concrete-600 mb-1.5">
              Delivery Address
            </p>
            <p>{order.address.fullName}</p>
            <p>{order.address.addressLine}, {order.address.district}, {order.address.division}</p>
            <p>{order.address.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrderLookup />
    </Suspense>
  );
}
