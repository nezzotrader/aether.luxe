import { connectToDatabase, hasDatabaseConfig } from "./db";
import { OrderModel } from "@/models/Order";
import { PromoCodeModel } from "@/models/PromoCode";
import type { PromoCode } from "@/types/product";

type PromoCodeDocument = {
  _id: { toString: () => string };
  code: string;
  type: "fixed" | "percent";
  value: number;
  isActive?: boolean;
  oneUsePerEmail?: boolean;
  createdAt: Date;
};

export function serializePromoCode(promo: PromoCodeDocument): PromoCode {
  return {
    _id: promo._id.toString(),
    code: promo.code,
    type: promo.type,
    value: promo.value,
    isActive: promo.isActive ?? true,
    oneUsePerEmail: promo.oneUsePerEmail ?? false,
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

export async function calculateDiscount(
  code: string | undefined,
  subtotal: number,
  customerEmail?: string | null,
) {
  const normalized = code?.trim().toUpperCase();
  const normalizedEmail = customerEmail?.trim().toLowerCase();

  if (!normalized || !hasDatabaseConfig()) {
    return { promoCode: undefined, discount: 0 };
  }

  await connectToDatabase();
  const promo = await PromoCodeModel.findOne({
    code: normalized,
    isActive: true,
  }).lean<PromoCodeDocument | null>();

  if (!promo) {
    return {
      promoCode: undefined,
      discount: 0,
      message: "Promo code is invalid or inactive.",
    };
  }

  if (promo.oneUsePerEmail) {
    if (!normalizedEmail) {
      return {
        promoCode: undefined,
        discount: 0,
        message: "Enter your email before applying this promo code.",
      };
    }

    const previousUse = await OrderModel.exists({
      customerEmail: normalizedEmail,
      promoCode: promo.code,
      paymentStatus: { $in: ["pending_receipt", "paid", "confirmed"] },
    });

    if (previousUse) {
      return {
        promoCode: undefined,
        discount: 0,
        message: "This promo code has already been used with this email.",
      };
    }
  }

  const rawDiscount =
    promo.type === "percent" ? subtotal * (promo.value / 100) : promo.value;
  const discount = Math.min(Math.max(Math.round(rawDiscount), 0), subtotal);

  return { promoCode: promo.code, discount };
}
