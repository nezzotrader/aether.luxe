import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { SHIPPING_OPTIONS } from "@/lib/constants";
import type { ShippingCountry } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { getOrders, serializeOrder } from "@/lib/orders";
import { calculateDiscount } from "@/lib/promos";
import { checkoutSchema } from "@/lib/validators";
import { OrderModel } from "@/models/Order";

export const runtime = "nodejs";

function composeShippingAddress(data: {
  shippingAddress?: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingPostcode: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: ShippingCountry;
}) {
  return [
    data.shippingAddressLine1,
    data.shippingAddressLine2,
    `${data.shippingPostcode} ${data.shippingCity}`,
    data.shippingState,
    data.shippingCountry,
  ]
    .filter(Boolean)
    .join(", ");
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid order." },
      { status: 400 },
    );
  }

  if (parsed.data.paymentMethod === "qr" && !parsed.data.receiptUrl) {
    return NextResponse.json(
      { message: "Please upload your payment receipt first." },
      { status: 400 },
    );
  }

  const subtotal = parsed.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = SHIPPING_OPTIONS[parsed.data.shippingCountry];
  const promoResult = await calculateDiscount(
    parsed.data.promoCode,
    subtotal,
    parsed.data.customerEmail,
    shippingFee,
  );
  const { promoCode, discount } = promoResult;

  if (parsed.data.promoCode && !promoCode) {
    return NextResponse.json(
      { message: promoResult.message || "Promo code is invalid or inactive." },
      { status: 400 },
    );
  }

  const total = Math.max(subtotal + shippingFee - discount, 0);

  await connectToDatabase();
  const order = await OrderModel.create({
    ...parsed.data,
    customerEmail: parsed.data.customerEmail.toLowerCase(),
    shippingAddress: composeShippingAddress(parsed.data),
    subtotal,
    shippingFee,
    promoCode,
    discount,
    total,
    paymentStatus:
      parsed.data.paymentMethod === "qr" ? "pending_receipt" : "pending_stripe",
  });

  return NextResponse.json({ order: serializeOrder(order.toObject()) }, { status: 201 });
}
