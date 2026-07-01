import { Schema, deleteModel, model, models } from "mongoose";

const ProductCustomOptionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    values: [{ type: String, required: true, trim: true }],
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true, trim: true },
    productCode: { type: String, required: true, unique: true, trim: true },
    images: [{ type: String, required: true }],
    colors: [{ type: String, trim: true }],
    sizes: [{ type: String, trim: true }],
    customOptions: { type: [ProductCustomOptionSchema], default: [] },
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

if (
  models.Product &&
  (!models.Product.schema.path("customOptions") ||
    !models.Product.schema.path("stock"))
) {
  deleteModel("Product");
}

export const ProductModel = models.Product || model("Product", ProductSchema);
