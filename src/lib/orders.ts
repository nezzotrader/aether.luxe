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
    items: order.items,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    receiptUrl: order.receiptUrl,
    stripeSessionId: order.stripeSessionId,
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
