"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { SelectedCustomOption } from "@/types/product";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  compact?: boolean;
};

export function AddToCartButton({ product, compact = false }: AddToCartButtonProps) {
  const { addProduct, buyNow } = useCart();
  const [added, setAdded] = useState(false);
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [customSelections, setCustomSelections] = useState<
    Record<string, string>
  >(
    Object.fromEntries(
      (product.customOptions || []).map((option) => [
        option.name,
        option.values[0] || "",
      ]),
    ),
  );

  const selectedOptions: SelectedCustomOption[] = (product.customOptions || [])
    .map((option) => ({
      name: option.name,
      value: customSelections[option.name] || option.values[0] || "",
    }))
    .filter((option) => option.value);

  function handleClick() {
    addProduct(product, { color, size, options: selectedOptions });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  function handleBuyNow() {
    buyNow(product, { color, size, options: selectedOptions });
  }

  if (
    !compact &&
    (product.colors?.length || product.sizes?.length || product.customOptions?.length)
  ) {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {product.colors?.length ? (
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                Colour / Design
              </span>
              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-[#1a060b] px-3 text-sm text-white outline-none focus:border-white/35"
              >
                {product.colors.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {product.sizes?.length ? (
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                Size
              </span>
              <select
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-[#1a060b] px-3 text-sm text-white outline-none focus:border-white/35"
              >
                {product.sizes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {product.customOptions?.map((option) => (
            <label key={option.name} className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                {option.name}
              </span>
              <select
                value={customSelections[option.name] || option.values[0] || ""}
                onChange={(event) =>
                  setCustomSelections((current) => ({
                    ...current,
                    [option.name]: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-md border border-white/10 bg-[#1a060b] px-3 text-sm text-white outline-none focus:border-white/35"
              >
                {option.values.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            {added ? "Added" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#7f1730] px-5 text-sm font-semibold text-white transition hover:bg-[#9a1d3a]"
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-3 text-xs font-semibold text-black transition hover:bg-[#d9d9d9]"
      >
        <ShoppingBag className="size-4" aria-hidden="true" />
        <span className="hidden min-[390px]:inline">
          {added ? "Added" : "Add to cart"}
        </span>
      </button>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      {added ? "Added" : "Add to cart"}
    </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#7f1730] px-5 text-sm font-semibold text-white transition hover:bg-[#9a1d3a]"
      >
        Buy Now
      </button>
    </div>
  );
}
