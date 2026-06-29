import Link from "next/link";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import type { Brand } from "@/types/product";

type CatalogFiltersProps = {
  search?: string;
  brand?: string;
  category?: string;
  sort?: string;
  brands: Brand[];
};

export function CatalogFilters({
  search = "",
  brand = "",
  category = "",
  sort = "newest",
  brands,
}: CatalogFiltersProps) {
  return (
    <form
      id="catalog"
      action="/"
      className="grid gap-3 border-y border-white/10 py-5 sm:grid-cols-3 lg:grid-cols-4"
    >
      <input type="hidden" name="search" value={search} />
      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-white/45">
          Brand
        </span>
        <select
          name="brand"
          defaultValue={brand}
          className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-white/35"
        >
          <option value="">All brands</option>
          {brands.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-white/45">
          Category
        </span>
        <select
          name="category"
          defaultValue={category}
          className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-white/35"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-white/45">
          Sort
        </span>
        <select
          name="sort"
          defaultValue={sort}
          className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-white/35"
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="h-11 flex-1 rounded-md bg-white px-4 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
        >
          Apply
        </button>
        <Link
          href="/#catalog"
          className="flex h-11 items-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:border-white/35 hover:text-white"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
