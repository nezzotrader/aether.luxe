"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  compact?: boolean;
};

export function AddToCartButton({ product, compact = false }: AddToCartButtonProps) {
  const { addProduct } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addProduct(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        compact
          ? "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-3 text-xs font-semibold text-black transition hover:bg-[#d9d9d9]"
          : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
      }
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
