import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/orders";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }
  // Require the phone number used on the order so order lookup can't be
  // used to browse other customers' orders/addresses.
  if (phone && order.address.phone.replace(/\s|-/g, "") !== phone.replace(/\s|-/g, "")) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}
