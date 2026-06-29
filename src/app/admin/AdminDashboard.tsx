"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Boxes,
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Save,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Brand, Order, Product, ProductPayload } from "@/types/product";

type AdminDashboardProps = {
  initialProducts: Product[];
  initialBrands: Brand[];
  initialOrders: Order[];
};

function makeEmptyProduct(brand = ""): ProductPayload {
  return {
    name: "",
    brand,
    category: CATEGORIES[0],
    price: 0,
    description: "",
    productCode: "",
    images: [],
    isActive: true,
  };
}

export function AdminDashboard({
  initialProducts,
  initialBrands,
  initialOrders,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<"products" | "brands" | "orders">("products");
  const [products, setProducts] = useState(initialProducts);
  const [brands, setBrands] = useState(initialBrands);
  const [orders, setOrders] = useState(initialOrders);
  const [productForm, setProductForm] = useState<ProductPayload>(
    makeEmptyProduct(initialBrands[0]?.name || ""),
  );
  const [brandForm, setBrandForm] = useState({ name: "", isActive: true });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive).length,
    [products],
  );

  async function refreshProducts() {
    const response = await fetch("/api/products?sort=newest&limit=1000");
    const data = await response.json();
    setProducts(data.products || []);
  }

  async function refreshBrands() {
    const response = await fetch("/api/brands");
    const data = await response.json();
    setBrands(data.brands || []);
  }

  async function refreshOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data.orders || []);
  }

  function resetProductForm() {
    setEditingProductId(null);
    setProductForm(makeEmptyProduct(brands[0]?.name || ""));
  }

  function resetBrandForm() {
    setEditingBrandId(null);
    setBrandForm({ name: "", isActive: true });
  }

  async function handleProductUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    setUploading(true);
    setMessage("");
    const uploadData = new FormData();
    Array.from(files).forEach((file) => uploadData.append("images", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Image upload failed.");
        return;
      }

      setProductForm((current) => ({
        ...current,
        images: [...current.images, ...data.images],
      }));
      setMessage("Images uploaded.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch(
      editingProductId ? `/api/products/${editingProductId}` : "/api/products",
      {
        method: editingProductId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      },
    );
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.message || "Product could not be saved.");
      return;
    }

    resetProductForm();
    await refreshProducts();
    setMessage("Product saved.");
  }

  function editProduct(product: Product) {
    setTab("products");
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description,
      productCode: product.productCode,
      images: product.images,
      isActive: product.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message || "Product could not be deleted.");
      return;
    }

    await refreshProducts();
  }

  async function saveBrand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch(
      editingBrandId ? `/api/brands/${editingBrandId}` : "/api/brands",
      {
        method: editingBrandId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandForm),
      },
    );
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.message || "Brand could not be saved.");
      return;
    }

    resetBrandForm();
    await refreshBrands();
    setMessage("Brand saved.");
  }

  async function deleteBrand(id: string) {
    if (!window.confirm("Delete this brand? Existing product brand names stay unchanged.")) {
      return;
    }

    const response = await fetch(`/api/brands/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message || "Brand could not be deleted.");
      return;
    }

    await refreshBrands();
  }

  async function updateOrder(id: string, paymentStatus: Order["paymentStatus"]) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Order could not be updated.");
      return;
    }

    await refreshOrders();
  }

  return (
    <main className="grid min-h-[calc(100vh-150px)] border-t border-white/10 bg-[#080405] lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
        <div className="hidden lg:block">
          <p className="font-display text-2xl font-semibold uppercase tracking-[0.18em] text-white">
            Aether
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
            Admin Panel
          </p>
        </div>
        <nav className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1">
          {[
            ["products", "Products", Boxes],
            ["brands", "Brands", Building2],
            ["orders", "Orders", ShoppingBag],
          ].map(([value, label, Icon]) => {
            const LucideIcon = Icon as typeof LayoutDashboard;
            return (
              <button
                key={value as string}
                type="button"
                onClick={() => setTab(value as "products" | "brands" | "orders")}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-3 text-sm lg:justify-start ${
                  tab === value
                    ? "bg-[#8b1d32] text-white"
                    : "border border-white/10 text-white/65"
                }`}
              >
                <LucideIcon className="size-4" aria-hidden="true" />
                {label as string}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/10 text-sm text-white/65 transition hover:border-white/35 hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </aside>

      <section className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              Dashboard
            </p>
            <h1 className="font-display text-4xl font-semibold text-white">
              {tab === "products" ? "Products" : tab === "brands" ? "Brands" : "Orders"}
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm text-white/75 transition hover:border-white/35"
          >
            View Store
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {message ? (
          <p className="mb-4 rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/70">
            {message}
          </p>
        ) : null}

        {tab === "products" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="rounded-lg border border-white/10 bg-[#100809]">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <p className="text-sm text-white/60">
                  {activeProducts} active / {products.length} total
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.18em] text-white/40">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-white/10">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative size-16 overflow-hidden rounded-md bg-[#1b1011]">
                              <Image src={product.images[0] || "/swan.svg"} alt={product.name} fill sizes="64px" className="object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{product.name}</p>
                              <p className="text-xs text-white/40">SKU: {product.productCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white/70">{product.brand}</td>
                        <td className="p-4 text-white/70">{product.category}</td>
                        <td className="p-4 text-white/70">{formatPrice(product.price)}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2 py-1 text-xs ${product.isActive ? "bg-green-500/15 text-green-200" : "bg-red-500/15 text-red-200"}`}>
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => editProduct(product)} className="grid size-9 place-items-center rounded-md border border-white/10 text-white/70">
                              <Pencil className="size-4" />
                            </button>
                            <button type="button" onClick={() => deleteProduct(product._id)} className="grid size-9 place-items-center rounded-md border border-white/10 text-white/70">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <form onSubmit={saveProduct} className="rounded-lg border border-white/10 bg-[#100809] p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-3xl font-semibold text-white">
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h2>
                {editingProductId ? (
                  <button type="button" onClick={resetProductForm} className="grid size-9 place-items-center rounded-md border border-white/10 text-white/65">
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="space-y-3">
                <input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required placeholder="Product name" className="h-11 w-full rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white outline-none placeholder:text-white/35" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={productForm.brand} onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })} className="h-11 rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white">
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                  <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} className="h-11 rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white">
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" min="0" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: Number(event.target.value) })} required placeholder="Price" className="h-11 rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white" />
                  <input value={productForm.productCode} onChange={(event) => setProductForm({ ...productForm, productCode: event.target.value })} required placeholder="SKU" className="h-11 rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white" />
                </div>
                <textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} required rows={4} placeholder="Description" className="w-full rounded-md border border-white/10 bg-[#170d0f] px-3 py-3 text-sm text-white" />
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={productForm.isActive} onChange={(event) => setProductForm({ ...productForm, isActive: event.target.checked })} />
                  Active on store
                </label>
                <input type="file" multiple accept="image/*" onChange={handleProductUpload} className="w-full rounded-md border border-white/10 bg-[#170d0f] p-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black" />
                <p className="text-xs text-white/45">{uploading ? "Uploading..." : "Upload multiple catalog/detail images."}</p>
                {productForm.images.length ? (
                  <div className="grid grid-cols-4 gap-2">
                    {productForm.images.map((image) => (
                      <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-[#1b1011]">
                        <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                        <button type="button" onClick={() => setProductForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/70 text-white">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <button type="submit" disabled={saving || uploading} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8b1d32] text-sm font-semibold text-white disabled:opacity-55">
                {editingProductId ? <Save className="size-4" /> : <Plus className="size-4" />}
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        ) : null}

        {tab === "brands" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-lg border border-white/10 bg-[#100809] p-4">
              <h2 className="font-display text-3xl text-white">Brands</h2>
              <div className="mt-4 grid gap-2">
                {brands.map((brand) => (
                  <div key={brand._id} className="flex items-center justify-between rounded-md border border-white/10 p-3">
                    <div>
                      <p className="text-white">{brand.name}</p>
                      <p className="text-xs text-white/45">{brand.isActive ? "Active" : "Inactive"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditingBrandId(brand._id); setBrandForm({ name: brand.name, isActive: brand.isActive }); }} className="grid size-9 place-items-center rounded-md border border-white/10 text-white/70">
                        <Pencil className="size-4" />
                      </button>
                      <button type="button" onClick={() => deleteBrand(brand._id)} className="grid size-9 place-items-center rounded-md border border-white/10 text-white/70">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={saveBrand} className="rounded-lg border border-white/10 bg-[#100809] p-5">
              <h2 className="font-display text-3xl text-white">{editingBrandId ? "Edit Brand" : "Add Brand"}</h2>
              <input value={brandForm.name} onChange={(event) => setBrandForm({ ...brandForm, name: event.target.value })} required placeholder="Brand name" className="mt-4 h-11 w-full rounded-md border border-white/10 bg-[#170d0f] px-3 text-sm text-white" />
              <label className="mt-4 flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={brandForm.isActive} onChange={(event) => setBrandForm({ ...brandForm, isActive: event.target.checked })} />
                Active on store
              </label>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={resetBrandForm} className="h-11 rounded-md border border-white/10 text-sm text-white/70">Cancel</button>
                <button type="submit" disabled={saving} className="h-11 rounded-md bg-[#8b1d32] text-sm font-semibold text-white">Save Brand</button>
              </div>
            </form>
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article key={order._id} className="rounded-lg border border-white/10 bg-[#100809] p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <p className="text-sm text-white/50">{order.customerEmail} / {order.customerPhone}</p>
                    <p className="mt-1 text-sm text-white/50">{order.shippingAddress}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-white">{formatPrice(order.total)}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">{order.paymentMethod} / {order.paymentStatus}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {order.items.map((item) => (
                    <div key={`${order._id}-${item.productId}`} className="flex justify-between text-sm text-white/60">
                      <span>{item.quantity} x {item.name}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {order.receiptUrl ? (
                    <a href={order.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-md border border-white/10 px-3 text-sm text-white/75">View receipt</a>
                  ) : null}
                  <button type="button" onClick={() => updateOrder(order._id, "confirmed")} className="h-10 rounded-md bg-green-700 px-3 text-sm font-semibold text-white">Confirm</button>
                  <button type="button" onClick={() => updateOrder(order._id, "rejected")} className="h-10 rounded-md bg-red-800 px-3 text-sm font-semibold text-white">Reject</button>
                </div>
              </article>
            ))}
            {!orders.length ? (
              <div className="rounded-lg border border-white/10 bg-[#100809] p-10 text-center text-white/55">No orders yet.</div>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
