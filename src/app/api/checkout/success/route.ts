import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/resend";
import { serializeOrder } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { OrderModel } from "@/models/Order";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ message: "Missing Stripe session." }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ paid: false });
  }

  const orderId = session.metadata?.orderId;

  if (orderId) {
    await connectToDatabase();
    const order = await OrderModel.findById(orderId);

    if (order) {
      order.paymentStatus = "confirmed";
      order.stripeSessionId = session.id;
      order.invoiceNumber =
        order.invoiceNumber ||
        `AETH-${new Date().getFullYear()}-${orderId.slice(-6).toUpperCase()}`;
      await order.save();

      const serializedOrder = serializeOrder(order.toObject());
      const invoiceUrl = `${new URL(request.url).origin}/invoice/${orderId}`;
      const email = await sendInvoiceEmail(serializedOrder, invoiceUrl);

      if (email.sent) {
        await OrderModel.findByIdAndUpdate(orderId, {
          invoiceEmailSentAt: new Date(),
        });
      }

      return NextResponse.json({ paid: true, confirmed: true, email });
    }
  }

  return NextResponse.json({ paid: true, confirmed: true });
}
