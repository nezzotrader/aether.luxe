"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addProduct: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function toCartItem(product: Product): CartItem {
  return {
    productId: product._id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images[0] || "/swan.svg",
    productCode: product.productCode,
    quantity: 1,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem("aether-cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    window.localStorage.setItem("aether-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      items,
      count,
      total,
      addProduct(product) {
        setItems((current) => {
          const existing = current.find((item) => item.productId === product._id);

          if (existing) {
            return current.map((item) =>
              item.productId === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...current, toCartItem(product)];
        });
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(quantity, 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(productId) {
        setItems((current) =>
          current.filter((item) => item.productId !== productId),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
