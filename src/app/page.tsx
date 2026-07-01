import Link from "next/link";
import { Grid2X2, Package, Shirt, ShoppingBag, Watch } from "lucide-react";
import { CatalogFilters } from "@/components/CatalogFilters";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CATEGORY_ICONS = [Grid2X2, ShoppingBag, Shirt, Package, Watch];

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

  const [brands, categories, productResult] = await Promise.all([
    getBrands({ activeOnly: true }),
    getCategories({ activeOnly: true }),
    getProducts({
      search,
      brand,
      category,
      sort,
      page,
      activeOnly: true,
    }),
  ]);
  const { products, total, pages } = productResult;

  return (
    <>
      <Header search={search} />
      <main>
        <section className="border-b border-white/10 bg-[linear-gradient(135deg,#070102_0%,#120407_48%,#3a0815_100%)]">
          <div className="mx-auto grid min-h-[300px] max-w-7xl items-center px-4 py-12 sm:min-h-[340px] sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                Luxury is in the details
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold uppercase leading-none tracking-[0.1em] text-white sm:text-6xl">
                Aether
              </h1>
              <p className="mt-4 max-w-lg text-xs uppercase leading-6 tracking-[0.2em] text-white/70 sm:text-sm">
                Curated catalog. Premium presentation. Smooth checkout.
              </p>
              <Link
                href="#catalog"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-[#7f1730] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#9a1d3a]"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#120407]">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8">
            <Link
              href="/#catalog"
              className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/75"
            >
              <Grid2X2 className="size-4" aria-hidden="true" />
              All
            </Link>
            {categories.map((item, index) => {
              const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
              return (
                <Link
                  key={item._id}
                  href={`/?category=${encodeURIComponent(item.name)}#catalog`}
                  className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:border-white/30 hover:text-white"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </section>

        <section
          id="catalog"
          className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Premium selection
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white">
                Latest Catalog
              </h2>
            </div>
            <p className="text-sm text-white/45">{total} products displayed</p>
          </div>

          <CatalogFilters
            search={search}
            brand={brand}
            category={category}
            sort={sort}
            brands={brands}
            categories={categories}
          />

          {products.length ? (
            <div className="mt-8 flex snap-x gap-3 overflow-x-auto pb-4 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="w-[40%] min-w-[40%] snap-start sm:w-auto sm:min-w-0"
                >
                  <ProductCard product={product} />
                </div>
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

        <section
          id="brands"
          className="border-y border-white/10 bg-[#100306] px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              Brands
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {brands.map((item) => (
                <Link
                  key={item._id}
                  href={`/?brand=${encodeURIComponent(item.name)}#catalog`}
                  className="rounded-md border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-white/35 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
