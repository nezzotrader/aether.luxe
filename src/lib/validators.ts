import { z } from "zod";
import { CATEGORIES, PAYMENT_METHODS } from "./constants";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  brand: z.string().trim().min(2, "Brand is required."),
  category: z.enum(CATEGORIES),
  price: z.coerce.number().nonnegative("Price must be 0 or higher."),
  description: z.string().trim().min(10, "Description is required."),
  productCode: z.string().trim().min(2, "Product code is required."),
  images: z.array(z.string().url()).min(1, "Upload at least one image."),
  isActive: z.boolean().default(true),
});

export const brandSchema = z.object({
  name: z.string().trim().min(2, "Brand name is required."),
  isActive: z.boolean().default(true),
});

export const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  price: z.coerce.number().nonnegative(),
  image: z.string().url(),
  productCode: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required."),
  customerEmail: z.string().trim().email("A valid email is required."),
  customerPhone: z.string().trim().min(6, "Phone number is required."),
  shippingAddress: z.string().trim().min(8, "Delivery address is required."),
  paymentMethod: z.enum(PAYMENT_METHODS),
  receiptUrl: z.string().url().optional(),
  items: z.array(cartItemSchema).min(1, "Cart is empty."),
});

export const orderStatusSchema = z.object({
  paymentStatus: z.enum([
    "pending_receipt",
    "pending_stripe",
    "paid",
    "confirmed",
    "rejected",
  ]),
});
