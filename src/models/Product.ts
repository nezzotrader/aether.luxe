import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    productCode: { type: String, required: true, unique: true, trim: true },
    images: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

ProductSchema.index({
  name: "text",
  brand: "text",
  productCode: "text",
});
ProductSchema.index({ brand: 1, category: 1, createdAt: -1 });

export const ProductModel = models.Product || model("Product", ProductSchema);
