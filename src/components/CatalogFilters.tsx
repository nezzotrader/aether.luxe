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

const COLLECTION_CHIPS = [
  { label: "All", href: "/#catalog" },
  { label: "Bestselling", href: "/?sort=newest#catalog" },
  { label: "New arrivals", href: "/?sort=newest#catalog" },
  { label: "Bags", href: "/?category=Bags#catalog" },
  { label: "Shoes", href: "/?category=Shoes#catalog" },
  { label: "Accessories", href: "/?category=Accessories#catalog" },
  { label: "Watches", href: "/?category=Watches#catalog" },
];

export function CatalogFilters({
  search = "",
  brand = "",
  category = "",
  sort = "newest",
  brands,
}: CatalogFiltersProps) {
  return (
    <div id="catalog" className="border-y border-white/10 py-3 sm:py-5">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {COLLECTION_CHIPS.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className="shrink-0 rounded-full border border-white/10 bg-[#120407] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:border-white/35 hover:text-white sm:px-4 sm:text-xs"
          >
            {chip.label}
          </Link>
        ))}
      </div>

      <form action="/" className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)_minmax(0,0.9fr)_58px_52px] items-end gap-1.5 sm:grid-cols-[1fr_1fr_1fr_auto_auto] sm:gap-2">
        <input type="hidden" name="search" value={search} />
        <label className="min-w-0 space-y-1">
          <span className="block truncate text-[9px] uppercase tracking-[0.14em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Brand
          </span>
          <select
            name="brand"
            defaultValue={brand}
            className="h-8 w-full min-w-0 rounded-md border border-white/10 bg-[#111111] px-1.5 text-[11px] text-white outline-none focus:border-white/35 sm:h-11 sm:px-3 sm:text-sm"
          >
            <option value="">All brands</option>
            {brands.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0 space-y-1">
          <span className="block truncate text-[9px] uppercase tracking-[0.14em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Category
          </span>
          <select
            name="category"
            defaultValue={category}
            className="h-8 w-full min-w-0 rounded-md border border-white/10 bg-[#111111] px-1.5 text-[11px] text-white outline-none focus:border-white/35 sm:h-11 sm:px-3 sm:text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0 space-y-1">
          <span className="block truncate text-[9px] uppercase tracking-[0.14em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Sort
          </span>
          <select
            name="sort"
            defaultValue={sort}
            className="h-8 w-full min-w-0 rounded-md border border-white/10 bg-[#111111] px-1.5 text-[11px] text-white outline-none focus:border-white/35 sm:h-11 sm:px-3 sm:text-sm"
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="h-8 rounded-md bg-white px-2 text-[11px] font-semibold text-black transition hover:bg-[#d9d9d9] sm:h-11 sm:px-4 sm:text-sm"
        >
          Apply
        </button>
        <Link
          href="/#catalog"
          className="flex h-8 items-center justify-center rounded-md border border-white/10 px-2 text-[11px] font-medium text-white/70 transition hover:border-white/35 hover:text-white sm:h-11 sm:px-4 sm:text-sm"
        >
          Reset
        </Link>
      </form>
    </div>
  );
}
