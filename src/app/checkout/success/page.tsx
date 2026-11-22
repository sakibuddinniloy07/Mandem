import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getOrderByNumber } from "@/lib/orders";
import { formatBDT } from "@/lib/format";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  return (
    <div className="container-max px-4 md:px-6 py-20 md:py-28 text-center max-w-xl mx-auto">
      <CheckCircle2 size={56} className="mx-auto mb-6" />
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-3">Order Confirmed</h1>
      <p className="text-concrete-600 mb-8">
        Thank you{order ? `, ${order.address.fullName.split(" ")[0]}` : ""}. We&apos;ve received your order
        {order ? (
          <>
            {" "}
            <span className="font-display text-ink">#{order.orderNumber}</span>
          </>
        ) : null}{" "}
        and will have it on the way shortly.
      </p>

      {order && (
        <div className="border border-concrete-200 text-left p-6 mb-8">
          <div className="flex justify-between font-display uppercase text-sm mb-3">
            <span>Payment Method</span>
            <span>{order.paymentMethod === "bkash" ? "bKash" : "Cash on Delivery"}</span>
          </div>
          <div className="flex justify-between font-display uppercase text-sm mb-3">
            <span>Status</span>
            <span>{order.status.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between font-display text-base pt-3 border-t border-concrete-200">
            <span>Total Paid</span>
            <span>{formatBDT(order.total)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href="/shop">Continue Shopping</Button>
        {order && (
          <Button href={`/orders?order=${order.orderNumber}&phone=${order.address.phone}`} variant="secondary">
            Track This Order
          </Button>
        )}
      </div>
      <p className="text-xs text-concrete-600 mt-6">
        Questions? <Link href="/contact" className="underline underline-offset-4">Contact us</Link>.
      </p>
    </div>
  );
}
