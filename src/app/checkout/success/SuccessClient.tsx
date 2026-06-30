"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  const paymentMethod = searchParams.get("method");
  const isQrOrder = paymentMethod === "qr";
  const [message, setMessage] = useState(
    isQrOrder
      ? "Your order has been received. It will only be accepted after the seller confirms your uploaded payment receipt."
      : sessionId
        ? "Confirming payment..."
        : "Payment session is missing.",
  );

  useEffect(() => {
    if (isQrOrder) {
      clearCart();
      return;
    }

    if (!sessionId) {
      return;
    }

    fetch("/api/checkout/success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.paid) {
          clearCart();
          setMessage(
            data.email?.sent
              ? "Payment received. Your order is confirmed and the invoice has been emailed."
              : "Payment received. Your order is confirmed.",
          );
          return;
        }

        setMessage("Stripe payment is not marked as paid yet.");
      })
      .catch(() => setMessage("Could not confirm payment. Please contact admin."));
  }, [clearCart, isQrOrder, sessionId]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-white/45">Checkout</p>
      <h1 className="mt-4 font-display text-5xl font-semibold text-white">
        {isQrOrder ? "Order received" : "Thank you"}
      </h1>
      {isQrOrder ? (
        <p className="mt-4 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
          Pending receipt confirmation
        </p>
      ) : null}
      <p className="mt-4 text-sm leading-6 text-white/60">{message}</p>
      {isQrOrder ? (
        <p className="mt-3 text-sm leading-6 text-white/45">
          Once your receipt is verified, your order will be confirmed and you can
          view it in your order history.
        </p>
      ) : null}
      <Link
        href="/#catalog"
        className="mt-8 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black"
      >
        Continue shopping
      </Link>
    </main>
  );
}
