import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    productCode: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    shippingAddress: { type: String, required: true, trim: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["qr", "stripe"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending_receipt", "pending_stripe", "paid", "confirmed", "rejected"],
      default: "pending_receipt",
    },
    receiptUrl: { type: String },
    stripeSessionId: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });

export const OrderModel = models.Order || model("Order", OrderSchema);
