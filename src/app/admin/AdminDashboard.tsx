"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { BRANDS, CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Product, ProductPayload } from "@/types/product";

const emptyForm: ProductPayload = {
  name: "",
  brand: BRANDS[0],
  category: CATEGORIES[0],
  price: 0,
  description: "",
  productCode: "",
  images: [],
};

type AdminDashboardProps = {
  initialProducts: Product[];
};

export function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const formTitle = editingId ? "Edit product" : "Add product";

  async function loadProducts() {
    setLoading(true);
    const response = await fetch("/api/products?sort=newest&limit=1000", {
      cache: "no-store",
    });
    const data = await response.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  const hasImages = useMemo(() => form.images.length > 0, [form.images]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    setUploading(true);
    setMessage("");
    const uploadData = new FormData();

    Array.from(files).forEach((file) => uploadData.append("images", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });
    const data = await response.json();
    setUploading(false);
    event.target.value = "";

    if (!response.ok) {
      setMessage(data.message || "Image upload failed.");
      return;
    }

    setForm((current) => ({
      ...current,
      images: [...current.images, ...data.images],
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch(
      editingId ? `/api/products/${editingId}` : "/api/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.message || "Product could not be saved.");
      return;
    }

    resetForm();
    await loadProducts();
    setMessage("Product saved.");
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this product from the catalog?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message || "Product could not be deleted.");
      return;
    }

    await loadProducts();
  }

  function editProduct(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description,
      productCode: product.productCode,
      images: product.images,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">
            Owner dashboard
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-white">
            Catalog control
          </h1>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/35 hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      <section className="grid gap-8 py-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="self-start rounded-lg border border-white/10 bg-[#101010] p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-white">
              {formTitle}
            </h2>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex size-9 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:border-white/35 hover:text-white"
                aria-label="Cancel editing"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                Images
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                className="w-full rounded-md border border-white/10 bg-[#151515] px-3 py-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
              />
              <span className="text-xs text-white/40">
                {uploading
                  ? "Uploading images..."
                  : "Upload product and close-up detail images."}
              </span>
            </label>

            {hasImages ? (
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((image) => (
                  <div
                    key={image}
                    className="relative aspect-square overflow-hidden rounded-md bg-[#1a1a1a]"
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="90px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          images: current.images.filter((item) => item !== image),
                        }))
                      }
                      className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-full bg-black/70 text-white"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                Product name
              </span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                className="h-11 w-full rounded-md border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-white/35"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Brand
                </span>
                <select
                  value={form.brand}
                  onChange={(event) => setForm({ ...form, brand: event.target.value })}
                  className="h-11 w-full rounded-md border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-white/35"
                >
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="h-11 w-full rounded-md border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-white/35"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Price
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: Number(event.target.value) })
                  }
                  required
                  className="h-11 w-full rounded-md border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-white/35"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Product code
                </span>
                <input
                  value={form.productCode}
                  onChange={(event) =>
                    setForm({ ...form, productCode: event.target.value })
                  }
                  required
                  className="h-11 w-full rounded-md border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-white/35"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-white/45">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                required
                rows={5}
                className="w-full rounded-md border border-white/10 bg-[#151515] px-3 py-3 text-sm text-white outline-none focus:border-white/35"
              />
            </label>
          </div>

          {message ? <p className="mt-4 text-sm text-white/65">{message}</p> : null}

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#d9d9d9] disabled:opacity-60"
          >
            {editingId ? <Save className="size-4" /> : <Plus className="size-4" />}
            {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
          </button>
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-white">
              Products
            </h2>
            <p className="text-sm text-white/45">{products.length} visible</p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-white/10 bg-[#101010] p-8 text-sm text-white/55">
              Loading products...
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="grid gap-4 rounded-lg border border-white/10 bg-[#101010] p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-[#1a1a1a]">
                    <Image
                      src={product.images[0] || "/swan.svg"}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                      {product.brand} / {product.category}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/55">
                      {product.productCode} / {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-white/70 transition hover:border-white/35 hover:text-white"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-white/70 transition hover:border-red-300/50 hover:text-red-200"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
