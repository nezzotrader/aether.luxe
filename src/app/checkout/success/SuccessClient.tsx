"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState(
    sessionId ? "Confirming payment..." : "Payment session is missing.",
  );

  useEffect(() => {
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
  }, [clearCart, sessionId]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-white/45">Checkout</p>
      <h1 className="mt-4 font-display text-5xl font-semibold text-white">
        Thank you
      </h1>
      <p className="mt-4 text-sm leading-6 text-white/60">{message}</p>
      <Link
        href="/#catalog"
        className="mt-8 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black"
      >
        Continue shopping
      </Link>
    </main>
  );
}
