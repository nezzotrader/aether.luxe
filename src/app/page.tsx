import { CatalogFilters } from "@/components/CatalogFilters";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const search = readParam(params, "search");
  const brand = readParam(params, "brand");
  const category = readParam(params, "category");
  const sort = readParam(params, "sort") || "newest";
  const page = Number(readParam(params, "page") || 1);
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries({ search, brand, category, sort })) {
    if (value) {
      queryParams.set(key, value);
    }
  }

  const { products, total, pages } = await getProducts({
    search,
    brand,
    category,
    sort,
    page,
  });

  return (
    <>
      <Header search={search} />
      <main>
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-white/45">
                Modern luxury catalog
              </p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.96] text-white sm:text-7xl">
                Pre-order now, arrive in 5-9 business days.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/60 lg:justify-self-end">
              Not Authentic but high quality. Highest quality replica products from the most reputable factories. We ensure that every piece in our collection meets our strict standards for craftsmanship and materials, so you can shop with confidence knowing you're getting the best of the best.
            </p>
          </div>
          <div className="silver-line mt-10 h-px w-full" />
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Catalog
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white">
                Latest Arrivals
              </h2>
            </div>
            <p className="text-sm text-white/45">{total} products displayed</p>
          </div>

          <CatalogFilters
            search={search}
            brand={brand}
            category={category}
            sort={sort}
          />

          {products.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-white/10 bg-[#101010] px-6 py-16 text-center">
              <h3 className="font-display text-3xl font-semibold text-white">
                No pieces found
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
                Try a different search, brand, or category filter.
              </p>
            </div>
          )}

          <Pagination page={page} pages={pages} params={queryParams} />
        </section>
      </main>
    </>
  );
}
