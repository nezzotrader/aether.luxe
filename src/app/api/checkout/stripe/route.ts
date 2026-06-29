import { NextResponse } from "next/server";
import { CURRENCY, SHIPPING_OPTIONS } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { serializeOrder } from "@/lib/orders";
import { calculateDiscount } from "@/lib/promos";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";
import { OrderModel } from "@/models/Order";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid checkout data." },
      { status: 400 },
    );
  }

  const subtotal = parsed.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = SHIPPING_OPTIONS[parsed.data.shippingCountry];
  const { promoCode, discount } = await calculateDiscount(
    parsed.data.promoCode,
    subtotal,
  );
  const total = Math.max(subtotal + shippingFee - discount, 0);
  const origin = new URL(request.url).origin;

  try {
    await connectToDatabase();
    const order = await OrderModel.create({
      ...parsed.data,
      customerEmail: parsed.data.customerEmail.toLowerCase(),
      subtotal,
      shippingFee,
      promoCode,
      discount,
      total,
      paymentMethod: "stripe",
      paymentStatus: "pending_stripe",
    });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: parsed.data.customerEmail,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY.toLowerCase(),
            unit_amount: Math.round(total * 100),
            product_data: {
              name: "Aether order",
              description: `${parsed.data.items.length} item(s), shipping included`,
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?payment=cancelled`,
    });

    await OrderModel.findByIdAndUpdate(order._id, {
      stripeSessionId: session.id,
    });

    return NextResponse.json({
      url: session.url,
      order: serializeOrder({ ...order.toObject(), stripeSessionId: session.id }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Stripe checkout could not be created.",
      },
      { status: 500 },
    );
  }
}
