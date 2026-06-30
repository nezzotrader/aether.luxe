import Link from "next/link";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#160409] transition hover:border-white/25">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative">
          <ProductImageCarousel
            images={product.images}
            name={product.name}
            quality={95}
            zoomOnHover
          />
        </div>
      </Link>

      <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
            {product.brand}
          </p>
          <Link
            href={`/products/${product._id}`}
            className="mt-1 block font-display text-lg font-semibold leading-tight text-white transition hover:text-[#d8d8d8] sm:text-xl"
          >
            {product.name}
          </Link>
          {product.soldCount ? (
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/35">
              {product.soldCount} sold
            </p>
          ) : null}
          <p className="mt-3 text-sm font-semibold text-[#d7d7d7]">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </article>
  );
}
