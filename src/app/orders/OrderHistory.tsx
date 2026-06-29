"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types/product";

export function OrderHistory() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchOrders(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch(
      `/api/customer-orders?email=${encodeURIComponent(email)}`,
    );
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Could not load orders.");
      return;
    }

    setOrders(data.orders || []);
    setMessage(data.orders?.length ? "" : "No orders found for this email.");
  }

  return (
    <main className="mx-auto min-h-[58vh] max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-white/45">Orders</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-white">
        Order history
      </h1>
      <form onSubmit={searchOrders} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          placeholder="Enter your checkout email"
          className="h-12 rounded-md border border-white/10 bg-[#12090a] px-4 text-sm text-white outline-none placeholder:text-white/35"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-md bg-white px-6 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Checking..." : "View orders"}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-white/55">{message}</p> : null}
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-lg border border-white/10 bg-[#120407] p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="font-semibold text-white">
                  {order.invoiceNumber || order._id}
                </p>
                <p className="text-sm text-white/50">
                  {order.paymentStatus} / {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-white">{formatPrice(order.total)}</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-white/60">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.cartItemId || item.productId}`} className="flex justify-between gap-4">
                  <span>
                    {item.quantity} x {item.name}
                    {item.color || item.size ? (
                      <span className="block text-xs text-white/40">
                        {[item.color ? `Colour / Design: ${item.color}` : "", item.size ? `Size: ${item.size}` : ""]
                          .filter(Boolean)
                          .join(" / ")}
                      </span>
                    ) : null}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            {order.paymentStatus === "confirmed" ? (
              <Link
                href={`/invoice/${order._id}`}
                className="mt-4 inline-flex h-10 items-center rounded-md border border-white/10 px-3 text-sm text-white/75"
              >
                View invoice
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
