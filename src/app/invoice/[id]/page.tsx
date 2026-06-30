import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { formatPrice } from "@/lib/format";
import { getOrderById } from "@/lib/orders";

export const dynamic = "force-dynamic";

type InvoicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order || order.paymentStatus !== "confirmed") {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-white/10 bg-[#120407] p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                Invoice
              </p>
              <h1 className="mt-2 font-display text-5xl font-semibold text-white">
                Aether
              </h1>
              <p className="mt-2 text-sm text-white/50">
                {order.invoiceNumber || order._id}
              </p>
            </div>
            <div className="text-sm text-white/60 sm:text-right">
              <p>{order.customerName}</p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {order.items.map((item) => (
              <div key={`${order._id}-${item.cartItemId || item.productId}`} className="flex justify-between gap-4 text-sm text-white/65">
                <span>
                  {item.quantity} x {item.name}
                  {item.color || item.size ? (
                    <span className="block text-xs text-white/40">
                      {[item.color ? `Colour / Design: ${item.color}` : "", item.size ? `Size: ${item.size}` : ""]
                        .filter(Boolean)
                        .join(" / ")}
                    </span>
                  ) : null}
                  {item.options?.length ? (
                    <span className="block text-xs text-white/40">
                      {item.options
                        .map((option) => `${option.name}: ${option.value}`)
                        .join(" / ")}
                    </span>
                  ) : null}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between text-white/55">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/55">
              <span>Shipping ({order.shippingCountry})</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            {order.discount ? (
              <div className="flex justify-between text-green-200/80">
                <span>Promo {order.promoCode}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-2 text-lg font-semibold text-white">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
