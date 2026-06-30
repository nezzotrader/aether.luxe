import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    cartItemId: { type: String, trim: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    productCode: { type: String, required: true },
    color: { type: String, trim: true },
    size: { type: String, trim: true },
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
    shippingAddressLine1: { type: String, trim: true },
    shippingAddressLine2: { type: String, trim: true },
    shippingPostcode: { type: String, trim: true },
    shippingCity: { type: String, trim: true },
    shippingState: { type: String, trim: true },
    shippingCountry: {
      type: String,
      enum: ["Malaysia", "Singapore"],
      default: "Malaysia",
    },
    shippingFee: { type: Number, default: 15, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    promoCode: { type: String, trim: true, uppercase: true },
    discount: { type: Number, default: 0, min: 0 },
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
    invoiceNumber: { type: String },
    invoiceEmailSentAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });

export const OrderModel = models.Order || model("Order", OrderSchema);
