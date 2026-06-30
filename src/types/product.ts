export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  productCode: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
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
  shippingCountry: "Malaysia" | "Singapore";
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
  createdAt: string;
};

export type PromoCode = {
  _id: string;
  code: string;
  type: "fixed" | "percent";
  value: number;
  isActive: boolean;
  createdAt: string;
};
