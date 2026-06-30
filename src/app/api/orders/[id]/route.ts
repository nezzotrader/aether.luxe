import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeOrder } from "@/lib/orders";
import { sendInvoiceEmail } from "@/lib/resend";
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

  if (parsed.data.paymentStatus === "rejected") {
    const deleted = await OrderModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: true });
  }

  const update =
    parsed.data.paymentStatus === "confirmed"
      ? {
          paymentStatus: "confirmed",
          invoiceNumber: `AETH-${new Date().getFullYear()}-${id.slice(-6).toUpperCase()}`,
        }
      : parsed.data;
  const order = await OrderModel.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  const serializedOrder = serializeOrder(order.toObject());
  let emailResult = { sent: false, message: "" };

  if (parsed.data.paymentStatus === "confirmed") {
    const invoiceUrl = `${new URL(request.url).origin}/invoice/${id}`;
    emailResult = await sendInvoiceEmail(serializedOrder, invoiceUrl);

    if (emailResult.sent) {
      await OrderModel.findByIdAndUpdate(id, {
        invoiceEmailSentAt: new Date(),
      });
    }
  }

  return NextResponse.json({ order: serializedOrder, email: emailResult });
}
