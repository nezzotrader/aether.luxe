import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
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
    await OrderModel.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      stripeSessionId: session.id,
    });
  }

  return NextResponse.json({ paid: true });
}
