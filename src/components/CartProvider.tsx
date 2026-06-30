"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem, Product, SelectedCustomOption } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addProduct: (
    product: Product,
    selection?: { color?: string; size?: string; options?: SelectedCustomOption[] },
  ) => void;
  buyNow: (
    product: Product,
    selection?: { color?: string; size?: string; options?: SelectedCustomOption[] },
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function normalizeSelectedOptions(options: SelectedCustomOption[] = []) {
  return options
    .filter((option) => option.name && option.value)
    .map((option) => ({
      name: option.name.trim(),
      value: option.value.trim(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function buildCartItemId(
  productId: string,
  color = "",
  size = "",
  options: SelectedCustomOption[] = [],
) {
  const optionKey = normalizeSelectedOptions(options)
    .map((option) => `${option.name}:${option.value}`)
    .join("|");
  return [productId, color, size, optionKey].join("::");
}

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    cartItemId:
      item.cartItemId ||
      buildCartItemId(
        item.productId,
        item.color || "",
        item.size || "",
        item.options || [],
      ),
    options: normalizeSelectedOptions(item.options || []),
  };
}

function toCartItem(
  product: Product,
  selection: {
    color?: string;
    size?: string;
    options?: SelectedCustomOption[];
  } = {},
): CartItem {
  const color = selection.color?.trim() || undefined;
  const size = selection.size?.trim() || undefined;
  const options = normalizeSelectedOptions(selection.options || []);

  return {
    cartItemId: buildCartItemId(product._id, color || "", size || "", options),
    productId: product._id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images[0] || "/swan.svg",
    productCode: product.productCode,
    color,
    size,
    options,
    quantity: 1,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem("aether-cart");
      hydrated.current = true;
      setItems(stored ? JSON.parse(stored).map(normalizeCartItem) : []);
    });
  }, []);

  useEffect(() => {
    if (!hydrated.current) {
      return;
    }

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
      addProduct(product, selection) {
        setItems((current) => {
          const nextItem = toCartItem(product, selection);
          const existing = current.find(
            (item) => item.cartItemId === nextItem.cartItemId,
          );

          if (existing) {
            return current.map((item) =>
              item.cartItemId === nextItem.cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...current, nextItem];
        });
      },
      buyNow(product, selection) {
        const nextItem = toCartItem(product, selection);
        setItems([nextItem]);
        window.localStorage.setItem("aether-cart", JSON.stringify([nextItem]));
        window.location.href = "/cart";
      },
      updateQuantity(cartItemId, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: Math.max(quantity, 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(cartItemId) {
        setItems((current) =>
          current.filter((item) => item.cartItemId !== cartItemId),
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
