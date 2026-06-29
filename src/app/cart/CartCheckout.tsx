"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CreditCard, Minus, Plus, QrCode, Trash2, Upload } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export function CartCheckout() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "stripe">("qr");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const canCheckout = useMemo(() => items.length > 0, [items]);

  useEffect(() => {
    fetch("/api/store-config", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setQrImage(data.qrPaymentImageUrl || ""))
      .catch(() => setQrImage(""));
  }, []);

  async function uploadReceipt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("receipt", file);
    const response = await fetch("/api/receipt-upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Receipt upload failed.");
      return;
    }

    setReceiptUrl(data.receiptUrl);
    setMessage("Receipt uploaded. You can submit your order now.");
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      shippingAddress: formData.get("shippingAddress"),
      paymentMethod,
      receiptUrl: receiptUrl || undefined,
      items,
    };

    const endpoint =
      paymentMethod === "stripe" ? "/api/checkout/stripe" : "/api/orders";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Checkout failed.");
      return;
    }

    if (paymentMethod === "stripe") {
      window.location.href = data.url;
      return;
    }

    clearCart();
    setReceiptUrl("");
    setMessage("Order submitted. Admin will confirm your receipt soon.");
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">Cart</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-white">
          Checkout
        </h1>

        <div className="mt-8 grid gap-4">
          {items.length ? (
            items.map((item) => (
              <article
                key={item.productId}
                className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 rounded-lg border border-white/10 bg-[#11090a] p-3 sm:grid-cols-[96px_minmax(0,1fr)_auto]"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-[#1a1011]">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {item.brand}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/50">{item.productCode}</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-md border border-white/10">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="grid size-9 place-items-center text-white/70"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span className="w-9 text-center text-sm text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="grid size-9 place-items-center text-white/70"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-white/55 transition hover:border-red-300/50 hover:text-red-200"
                    aria-label="Remove item"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-[#11090a] p-10 text-center">
              <p className="font-display text-3xl text-white">Your cart is empty.</p>
              <Link href="/#catalog" className="mt-5 inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-black">
                Browse catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      <aside className="rounded-lg border border-white/10 bg-[#11090a] p-5 lg:sticky lg:top-36 lg:self-start">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-3xl font-semibold text-white">Order</h2>
          <p className="text-xl font-semibold text-white">{formatPrice(total)}</p>
        </div>

        <form onSubmit={submitOrder} className="mt-5 space-y-4">
          <input name="customerName" required placeholder="Full name" className="h-11 w-full rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35" />
          <input name="customerEmail" required type="email" placeholder="Email" className="h-11 w-full rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35" />
          <input name="customerPhone" required placeholder="Phone number" className="h-11 w-full rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35" />
          <textarea name="shippingAddress" required rows={4} placeholder="Delivery address" className="w-full rounded-md border border-white/10 bg-[#170d0f] px-3 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35" />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("qr")}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold ${
                paymentMethod === "qr"
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-white/70"
              }`}
            >
              <QrCode className="size-4" aria-hidden="true" />
              QR
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("stripe")}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold ${
                paymentMethod === "stripe"
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-white/70"
              }`}
            >
              <CreditCard className="size-4" aria-hidden="true" />
              Stripe
            </button>
          </div>

          {paymentMethod === "qr" ? (
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              {qrImage ? (
                <div className="relative mx-auto aspect-square w-44 overflow-hidden rounded-md bg-white">
                  <Image src={qrImage} alt="Payment QR code" fill sizes="176px" className="object-contain" />
                </div>
              ) : (
                <p className="text-sm leading-6 text-white/55">
                  Add `QR_PAYMENT_IMAGE_URL` or `NEXT_PUBLIC_QR_PAYMENT_IMAGE_URL`
                  in Vercel, then redeploy to show your QR image here.
                </p>
              )}
              <label className="mt-4 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 text-sm font-semibold text-white/75 transition hover:border-white/35">
                <Upload className="size-4" aria-hidden="true" />
                Upload payment receipt
                <input type="file" accept="image/*" onChange={uploadReceipt} className="hidden" />
              </label>
              {receiptUrl ? (
                <a href={receiptUrl} target="_blank" rel="noreferrer" className="mt-2 block text-xs text-white/55 underline">
                  Receipt uploaded
                </a>
              ) : null}
            </div>
          ) : null}

          {message ? <p className="text-sm text-white/65">{message}</p> : null}

          <button
            type="submit"
            disabled={!canCheckout || loading}
            className="h-12 w-full rounded-md bg-[#8b1d32] px-5 text-sm font-semibold text-white transition hover:bg-[#a42a42] disabled:opacity-55"
          >
            {loading ? "Processing..." : paymentMethod === "stripe" ? "Pay with Stripe" : "Submit QR Order"}
          </button>
        </form>
      </aside>
    </main>
  );
}
