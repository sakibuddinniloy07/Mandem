import { NextResponse } from "next/server";
import { createBkashPayment, isBkashConfigured } from "@/lib/bkash";
import { getOrderByNumber, updateOrderPayment } from "@/lib/orders";

export async function POST(req: Request) {
  try {
    const { orderNumber } = (await req.json()) as { orderNumber: string };
    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    }
    if (order.paymentMethod !== "bkash") {
      return NextResponse.json({ ok: false, error: "This order is not a bKash order." }, { status: 400 });
    }

    if (!isBkashConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "bKash isn't configured yet on this store. Add BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, BKASH_PASSWORD and BKASH_CALLBACK_URL to enable live payments (see .env.example).",
        },
        { status: 503 }
      );
    }

    const payment = await createBkashPayment({ amount: order.total, orderNumber: order.orderNumber });
    await updateOrderPayment(order.orderNumber, { bkashPaymentId: payment.paymentID });

    return NextResponse.json({ ok: true, bkashURL: payment.bkashURL });
  } catch (err) {
    console.error("bKash create payment failed", err);
    return NextResponse.json({ ok: false, error: "Could not start bKash payment." }, { status: 500 });
  }
}
