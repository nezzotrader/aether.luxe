import Link from "next/link";
import { Heart } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#150b0d] transition hover:border-white/25">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative">
          <ProductImageCarousel images={product.images} name={product.name} />
          <button
            type="button"
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
            aria-label="Save item"
          >
            <Heart className="size-4" aria-hidden="true" />
          </button>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
            {product.brand}
          </p>
          <Link
            href={`/products/${product._id}`}
            className="mt-1 block font-display text-xl font-semibold text-white transition hover:text-[#d8d8d8]"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#d7d7d7]">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
