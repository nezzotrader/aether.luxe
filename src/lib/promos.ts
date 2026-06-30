import { connectToDatabase, hasDatabaseConfig } from "./db";
import { OrderModel } from "@/models/Order";
import { PromoCodeModel } from "@/models/PromoCode";
import type { PromoCode } from "@/types/product";

type PromoCodeDocument = {
  _id: { toString: () => string };
  code: string;
  type: "fixed" | "percent" | "free_shipping";
  value: number;
  minSpend?: number;
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
    minSpend: promo.minSpend ?? 0,
    isActive: promo.isActive ?? true,
    oneUsePerEmail: promo.oneUsePerEmail ?? false,
    createdAt: promo.createdAt.toISOString(),
  };
}

async function ensureFreeShippingPromo() {
  await PromoCodeModel.updateOne(
    { code: "FREESHIP" },
    {
      $setOnInsert: {
        code: "FREESHIP",
        type: "free_shipping",
        value: 0,
        minSpend: 0,
        isActive: true,
        oneUsePerEmail: false,
      },
    },
    { upsert: true },
  );
}

export async function getPromoCodes() {
  if (!hasDatabaseConfig()) {
    return [];
  }

  await connectToDatabase();
  await ensureFreeShippingPromo();
  const promos = await PromoCodeModel.find({})
    .sort({ createdAt: -1 })
    .lean<PromoCodeDocument[]>();
  return promos.map(serializePromoCode);
}

export async function calculateDiscount(
  code: string | undefined,
  subtotal: number,
  customerEmail?: string | null,
  shippingFee = 0,
) {
  const normalized = code?.trim().toUpperCase();
  const normalizedEmail = customerEmail?.trim().toLowerCase();

  if (!normalized) {
    return { promoCode: undefined, discount: 0 };
  }

  if (!hasDatabaseConfig()) {
    return { promoCode: undefined, discount: 0 };
  }

  await connectToDatabase();
  await ensureFreeShippingPromo();
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

  const minSpend = promo.minSpend ?? 0;

  if (minSpend > 0 && subtotal < minSpend) {
    return {
      promoCode: undefined,
      discount: 0,
      message: `Spend at least ${minSpend} to use this promo code.`,
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
    promo.type === "free_shipping"
      ? shippingFee
      : promo.type === "percent"
        ? subtotal * (promo.value / 100)
        : promo.value;
  const maxDiscount = promo.type === "free_shipping" ? shippingFee : subtotal;
  const discount = Math.min(Math.max(Math.round(rawDiscount), 0), maxDiscount);

  return { promoCode: promo.code, discount };
}
