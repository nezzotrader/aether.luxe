import { connectToDatabase, hasDatabaseConfig } from "./db";
import { OrderModel } from "@/models/Order";
import type { Order } from "@/types/product";

type OrderDocument = Omit<Order, "_id" | "createdAt"> & {
  _id: { toString: () => string };
  createdAt: Date;
};

export function serializeOrder(order: OrderDocument): Order {
  return {
    _id: order._id.toString(),
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    shippingAddressLine1: order.shippingAddressLine1,
    shippingAddressLine2: order.shippingAddressLine2,
    shippingPostcode: order.shippingPostcode,
    shippingCity: order.shippingCity,
    shippingState: order.shippingState,
    shippingCountry: order.shippingCountry ?? "Malaysia",
    shippingFee: order.shippingFee ?? 15,
    subtotal: order.subtotal ?? order.total,
    promoCode: order.promoCode,
    discount: order.discount ?? 0,
    items: order.items,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    receiptUrl: order.receiptUrl,
    stripeSessionId: order.stripeSessionId,
    invoiceNumber: order.invoiceNumber,
    createdAt: order.createdAt.toISOString(),
  };
}

export async function getOrders() {
  if (!hasDatabaseConfig()) {
    return [];
  }

  await connectToDatabase();
  const orders = await OrderModel.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean<OrderDocument[]>();
  return orders.map(serializeOrder);
}

export async function getCustomerOrders(email: string) {
  if (!hasDatabaseConfig()) {
    return [];
  }

  await connectToDatabase();
  const orders = await OrderModel.find({
    customerEmail: email.trim().toLowerCase(),
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<OrderDocument[]>();
  return orders.map(serializeOrder);
}

export async function getOrderById(id: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  await connectToDatabase();
  const order = await OrderModel.findById(id).lean<OrderDocument | null>();
  return order ? serializeOrder(order) : null;
}
