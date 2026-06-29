import { NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/orders";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  const orders = await getCustomerOrders(email);
  return NextResponse.json({ orders });
}
