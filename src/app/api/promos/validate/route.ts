import { NextResponse } from "next/server";
import { calculateDiscount } from "@/lib/promos";
import { promoValidationSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = promoValidationSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid promo code." }, { status: 400 });
  }

  const result = await calculateDiscount(
    parsed.data.code,
    parsed.data.subtotal,
    parsed.data.customerEmail || undefined,
  );

  if (!result.promoCode) {
    return NextResponse.json(
      { message: result.message || "Promo code is invalid or inactive.", discount: 0 },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
