import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AboutPage() {
  return (
    <>
      <Header showSearch={false} />
      <main className="mx-auto grid min-h-[58vh] max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">
            About us
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-white">
            Aether is built for clean browsing and confident ordering.
          </h1>
        </div>
        <div className="space-y-5 text-base leading-8 text-white/62">
          <p>
            Browse multiple product images from the catalog, add items to cart,
            checkout by QR transfer with receipt attachment, or use Stripe card
            payment.
          </p>
          <p>
            Admin can manage catalog items, brands, and order confirmation from
            one private panel.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
