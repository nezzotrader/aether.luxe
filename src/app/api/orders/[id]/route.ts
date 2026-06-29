import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeOrder } from "@/lib/orders";
import { orderStatusSchema } from "@/lib/validators";
import { OrderModel } from "@/models/Order";

export const runtime = "nodejs";

type OrderRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: OrderRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = orderStatusSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid order status." }, { status: 400 });
  }

  const { id } = await context.params;
  await connectToDatabase();
  const order = await OrderModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: serializeOrder(order.toObject()) });
}
