import { connectToDatabase, hasDatabaseConfig } from "./db";
import { PromoCodeModel } from "@/models/PromoCode";
import type { PromoCode } from "@/types/product";

type PromoCodeDocument = {
  _id: { toString: () => string };
  code: string;
  type: "fixed" | "percent";
  value: number;
  isActive?: boolean;
  createdAt: Date;
};

export function serializePromoCode(promo: PromoCodeDocument): PromoCode {
  return {
    _id: promo._id.toString(),
    code: promo.code,
    type: promo.type,
    value: promo.value,
    isActive: promo.isActive ?? true,
    createdAt: promo.createdAt.toISOString(),
  };
}

export async function getPromoCodes() {
  if (!hasDatabaseConfig()) {
    return [];
  }

  await connectToDatabase();
  const promos = await PromoCodeModel.find({})
    .sort({ createdAt: -1 })
    .lean<PromoCodeDocument[]>();
  return promos.map(serializePromoCode);
}

export async function calculateDiscount(code: string | undefined, subtotal: number) {
  const normalized = code?.trim().toUpperCase();

  if (!normalized || !hasDatabaseConfig()) {
    return { promoCode: undefined, discount: 0 };
  }

  await connectToDatabase();
  const promo = await PromoCodeModel.findOne({
    code: normalized,
    isActive: true,
  }).lean<PromoCodeDocument | null>();

  if (!promo) {
    return { promoCode: undefined, discount: 0 };
  }

  const rawDiscount =
    promo.type === "percent" ? subtotal * (promo.value / 100) : promo.value;
  const discount = Math.min(Math.max(Math.round(rawDiscount), 0), subtotal);

  return { promoCode: promo.code, discount };
}
