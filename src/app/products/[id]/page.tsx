import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ORDER_FORM_URL } from "@/lib/constants";
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

  const [heroImage, ...detailImages] = product.images;

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

        <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-[#111111]">
              <Image
                src={heroImage || "/swan.svg"}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {detailImages.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {detailImages.map((image, index) => (
                  <div
                    key={image}
                    className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#111111]"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} close-up detail ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 20vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
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
                <dt className="text-white/40">Added</dt>
                <dd className="mt-1 font-medium text-white">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>

            <p className="mt-7 text-base leading-7 text-white/62">
              {product.description}
            </p>

            <div className="mt-10 rounded-lg border border-white/10 bg-[#111111] p-6">
              <h2 className="font-display text-3xl font-semibold text-white">
                Interested in ordering?
              </h2>
              <a
                href={ORDER_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
              >
                Order via Google Form
              </a>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
