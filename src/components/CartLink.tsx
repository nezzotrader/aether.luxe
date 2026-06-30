"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-2 text-sm text-white/80 transition hover:border-white/35 hover:text-white md:px-3"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      <span className="hidden md:inline">Cart</span>
      {count ? (
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-white text-xs font-bold text-black">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
