import type { ShippingCountry } from "@/lib/constants";

export type ProductCustomOption = {
  name: string;
  values: string[];
};

export type SelectedCustomOption = {
  name: string;
  value: string;
};

export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  productCode: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  customOptions?: ProductCustomOption[];
  soldCount?: number;
  isActive: boolean;
  createdAt: string;
};

export type ProductPayload = Omit<Product, "_id" | "createdAt">;

export type Brand = {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  productCode: string;
  color?: string;
  size?: string;
  options?: SelectedCustomOption[];
  quantity: number;
};

export type OrderStatus =
  | "pending_receipt"
  | "pending_stripe"
  | "paid"
  | "confirmed"
  | "rejected";

export type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingPostcode?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry: ShippingCountry;
  shippingFee: number;
  subtotal: number;
  promoCode?: string;
  discount: number;
  items: CartItem[];
  total: number;
  paymentMethod: "qr" | "stripe";
  paymentStatus: OrderStatus;
  receiptUrl?: string;
  stripeSessionId?: string;
  invoiceNumber?: string;
  invoiceEmailSentAt?: string;
  createdAt: string;
};

export type PromoCode = {
  _id: string;
  code: string;
  type: "fixed" | "percent" | "free_shipping";
  value: number;
  minSpend: number;
  isActive: boolean;
  oneUsePerEmail: boolean;
  createdAt: string;
};
