import { Schema, deleteModel, model, models } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    type: { type: String, enum: ["fixed", "percent", "free_shipping"], required: true },
    value: { type: Number, required: true, min: 0 },
    minSpend: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    oneUsePerEmail: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

if (
  models.PromoCode &&
  (!models.PromoCode.schema.path("oneUsePerEmail") ||
    !models.PromoCode.schema.path("minSpend") ||
    !models.PromoCode.schema.path("type")?.options?.enum?.includes("free_shipping"))
) {
  deleteModel("PromoCode");
}

export const PromoCodeModel =
  models.PromoCode || model("PromoCode", PromoCodeSchema);
