import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getOrders, serializeOrder } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validators";
import { OrderModel } from "@/models/Order";

export const runtime = "nodejs";

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

  const total = parsed.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await connectToDatabase();
  const order = await OrderModel.create({
    ...parsed.data,
    total,
    paymentStatus:
      parsed.data.paymentMethod === "qr" ? "pending_receipt" : "pending_stripe",
  });

  return NextResponse.json({ order: serializeOrder(order.toObject()) }, { status: 201 });
}
