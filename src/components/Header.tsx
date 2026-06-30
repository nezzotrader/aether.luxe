import Link from "next/link";
import { Search, ShieldUser, UserRound } from "lucide-react";
import { CartLink } from "./CartLink";

type HeaderProps = {
  search?: string;
  showSearch?: boolean;
};

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/#catalog" },
  { label: "Brands", href: "/#brands" },
  { label: "About Us", href: "/about" },
];

export function Header({ search = "", showSearch = true }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#070102]/95">
      <div className="mx-auto grid w-full max-w-7xl gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:grid-cols-[1fr_auto_1fr] md:gap-3">
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

          <Link href="/" className="flex min-w-0 flex-col items-start text-left md:items-center md:text-center">
            <span className="font-display text-xl font-semibold uppercase tracking-[0.22em] text-white min-[390px]:text-2xl sm:text-4xl sm:tracking-[0.28em]">
              Aether
            </span>
            <span className="text-[8px] uppercase tracking-[0.24em] text-white/45 sm:text-[10px] sm:tracking-[0.28em]">
              Luxe by Azfar
            </span>
          </Link>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <CartLink />
            <Link
              href="/orders"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-2 text-sm text-white/80 transition hover:border-white/35 hover:text-white sm:px-3"
            >
              <UserRound className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:border-white/35 hover:text-white sm:px-3"
            >
              <ShieldUser className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>

        <nav className="grid grid-cols-4 gap-2 border-y border-white/10 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex h-9 min-w-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.035] px-1 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white/75 transition hover:border-white/35 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {showSearch ? (
          <form action="/" className="relative mx-auto w-full max-w-4xl">
            <Search
              aria-hidden="true"
              className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
            />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search for products, brands, or categories..."
              className="h-10 w-full rounded-md border border-white/10 bg-white/[0.035] px-11 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35 sm:h-12"
            />
          </form>
        ) : null}
      </div>
    </header>
  );
}
