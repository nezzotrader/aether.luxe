import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/resend";
import { getOrderById } from "@/lib/orders";
import { OrderModel } from "@/models/Order";

export const runtime = "nodejs";

type OrderEmailRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: OrderEmailRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus !== "confirmed") {
    return NextResponse.json(
      { message: "Confirm this order before sending an invoice." },
      { status: 400 },
    );
  }

  const invoiceUrl = `${new URL(request.url).origin}/invoice/${id}`;
  const result = await sendInvoiceEmail(order, invoiceUrl);

  if (result.sent) {
    await connectToDatabase();
    await OrderModel.findByIdAndUpdate(id, { invoiceEmailSentAt: new Date() });
  }

  const status = result.sent ? 200 : 400;

  return NextResponse.json(result, { status });
}
