import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import type { Address, CartLine } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      lines: CartLine[];
      address: Address;
      paymentMethod: "bkash" | "cod";
    };

    if (!body.address?.fullName || !body.address?.phone || !body.address?.addressLine) {
      return NextResponse.json({ ok: false, error: "Missing required address fields." }, { status: 400 });
    }
    if (!/^01[3-9][0-9]{8}$/.test(body.address.phone.replace(/\s|-/g, ""))) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid Bangladeshi mobile number." },
        { status: 400 }
      );
    }

    const result = await createOrder({
      lines: body.lines,
      address: body.address,
      paymentMethod: body.paymentMethod,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json({ ok: false, error: "Something went wrong creating your order." }, { status: 500 });
  }
}
