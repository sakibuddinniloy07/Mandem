import { NextResponse } from "next/server";
import { executeBkashPayment } from "@/lib/bkash";
import {
  getOrderByBkashPaymentId,
  getOrderItemsForStockDecrement,
  updateOrderPayment,
} from "@/lib/orders";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// bKash redirects the customer's browser here (GET) after they approve,
// cancel, or fail the payment on the hosted bKash page.
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status"); // success | failure | cancel

  if (!paymentID) {
    return NextResponse.redirect(`${origin}/checkout/failed`);
  }

  const order = await getOrderByBkashPaymentId(paymentID);
  if (!order) {
    return NextResponse.redirect(`${origin}/checkout/failed`);
  }

  if (status !== "success") {
    await updateOrderPayment(order.orderNumber, { status: "failed" });
    return NextResponse.redirect(`${origin}/checkout/failed?order=${order.orderNumber}`);
  }

  try {
    const result = await executeBkashPayment(paymentID);
    const paid = result.statusCode === "0000" && result.transactionStatus === "Completed";

    if (!paid) {
      await updateOrderPayment(order.orderNumber, { status: "failed" });
      return NextResponse.redirect(`${origin}/checkout/failed?order=${order.orderNumber}`);
    }

    await updateOrderPayment(order.orderNumber, {
      status: "paid",
      bkashTrxId: result.trxID,
    });

    // Decrement live stock now that payment is confirmed.
    const admin = getSupabaseAdmin();
    if (admin) {
      const items = await getOrderItemsForStockDecrement(order.orderNumber);
      for (const item of items) {
        await admin.rpc("decrement_stock", { p_sku: item.variant_sku, p_qty: item.qty });
      }
    }

    return NextResponse.redirect(`${origin}/checkout/success?order=${order.orderNumber}`);
  } catch (err) {
    console.error("bKash execute failed", err);
    await updateOrderPayment(order.orderNumber, { status: "failed" });
    return NextResponse.redirect(`${origin}/checkout/failed?order=${order.orderNumber}`);
  }
}
