import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/#catalog"
          className="text-sm font-medium text-white/55 transition hover:text-white"
        >
          Back to catalog
        </Link>

        <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#111111]">
            <ProductImageCarousel
              images={product.images}
              name={product.name}
              priority
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
              quality={100}
            />
          </div>

          <aside className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              {product.brand}
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-none text-white sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-2xl font-semibold text-[#d8d8d8]">
              {formatPrice(product.price)}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 border-y border-white/10 py-6 text-sm">
              <div>
                <dt className="text-white/40">Product code</dt>
                <dd className="mt-1 font-medium text-white">
                  {product.productCode}
                </dd>
              </div>
              <div>
                <dt className="text-white/40">Category</dt>
                <dd className="mt-1 font-medium text-white">{product.category}</dd>
              </div>
              <div>
                <dt className="text-white/40">Brand</dt>
                <dd className="mt-1 font-medium text-white">{product.brand}</dd>
              </div>
              <div>
                <dt className="text-white/40">Availability</dt>
                <dd className="mt-1 font-medium text-white">
                  {product.isActive ? "Active" : "Inactive"}
                </dd>
              </div>
              {product.colors?.length ? (
                <div>
                  <dt className="text-white/40">Colour / Design</dt>
                  <dd className="mt-1 font-medium text-white">
                    {product.colors.join(", ")}
                  </dd>
                </div>
              ) : null}
              {product.sizes?.length ? (
                <div>
                  <dt className="text-white/40">Sizes</dt>
                  <dd className="mt-1 font-medium text-white">
                    {product.sizes.join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-7 text-base leading-7 text-white/62">
              {product.description}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <AddToCartButton product={product} />
              <Link
                href="/cart"
                className="inline-flex h-12 w-full items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-white/35"
              >
                View cart
              </Link>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
