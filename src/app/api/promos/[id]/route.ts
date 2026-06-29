import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializePromoCode } from "@/lib/promos";
import { promoCodeSchema } from "@/lib/validators";
import { PromoCodeModel } from "@/models/PromoCode";

export const runtime = "nodejs";

type PromoRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: PromoRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = promoCodeSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid promo code." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  await connectToDatabase();
  const promo = await PromoCodeModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  });

  if (!promo) {
    return NextResponse.json({ message: "Promo not found." }, { status: 404 });
  }

  return NextResponse.json({ promo: serializePromoCode(promo.toObject()) });
}

export async function DELETE(_request: Request, context: PromoRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await connectToDatabase();
  const promo = await PromoCodeModel.findByIdAndDelete(id);

  if (!promo) {
    return NextResponse.json({ message: "Promo not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
