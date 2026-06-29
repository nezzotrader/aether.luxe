import { Schema, model, models } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    type: { type: String, enum: ["fixed", "percent"], required: true },
    value: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const PromoCodeModel =
  models.PromoCode || model("PromoCode", PromoCodeSchema);
