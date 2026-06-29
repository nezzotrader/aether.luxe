import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getPromoCodes, serializePromoCode } from "@/lib/promos";
import { promoCodeSchema } from "@/lib/validators";
import { PromoCodeModel } from "@/models/PromoCode";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const promos = await getPromoCodes();
  return NextResponse.json({ promos });
}

export async function POST(request: Request) {
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

  await connectToDatabase();
  const promo = await PromoCodeModel.create(parsed.data);
  return NextResponse.json(
    { promo: serializePromoCode(promo.toObject()) },
    { status: 201 },
  );
}
