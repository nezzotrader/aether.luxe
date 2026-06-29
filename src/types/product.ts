export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  productCode: string;
  images: string[];
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
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  productCode: string;
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
  items: CartItem[];
  total: number;
  paymentMethod: "qr" | "stripe";
  paymentStatus: OrderStatus;
  receiptUrl?: string;
  stripeSessionId?: string;
  createdAt: string;
};
