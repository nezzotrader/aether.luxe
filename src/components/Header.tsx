import Link from "next/link";
import { ShieldUser, Search } from "lucide-react";
import { CartLink } from "./CartLink";
import { SwanLogo } from "./SwanLogo";

type HeaderProps = {
  search?: string;
};

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/#catalog" },
  { label: "Brands", href: "/#brands" },
  { label: "About Us", href: "/about" },
];

export function Header({ search = "" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080505]/95 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="flex flex-col items-center text-center">
            <SwanLogo size={38} />
            <span className="mt-1 font-display text-3xl font-semibold uppercase tracking-[0.28em] text-white sm:text-4xl">
              Aether
            </span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/45">
              Luxe by Azfar
            </span>
          </Link>

          <div className="flex items-center justify-end gap-2">
            <CartLink />
            <Link
              href="/admin"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:border-white/35 hover:text-white"
            >
              <ShieldUser className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          </div>
        </div>

        <nav className="flex items-center justify-between gap-2 overflow-x-auto border-y border-white/10 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="shrink-0 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/" className="relative mx-auto w-full max-w-4xl">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
          />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search for products, brands, or categories..."
            className="h-12 w-full rounded-md border border-white/10 bg-white/[0.035] px-11 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35"
          />
        </form>
      </div>
    </header>
  );
}
