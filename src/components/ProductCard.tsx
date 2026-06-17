import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#111111] transition hover:border-white/25">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#181818]">
          <Image
            src={product.images[0] || "/swan.svg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.025]"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              {product.brand}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              {product.name}
            </h2>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[#d7d7d7]">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/55">
          <span>{product.category}</span>
          <span className="h-px w-5 bg-white/20" />
          <span>{product.productCode}</span>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-white/62">
          {product.description}
        </p>

        <Link
          href={`/products/${product._id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#c8c8c8]"
        >
          View Details
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
