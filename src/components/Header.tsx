import Link from "next/link";
import { Search } from "lucide-react";
import { SwanLogo } from "./SwanLogo";

type HeaderProps = {
  search?: string;
};

export function Header({ search = "" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <SwanLogo size={42} />
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold tracking-wide text-white sm:text-2xl">
                Aether Luxe by Azfar
              </p>
              <p className="hidden text-xs uppercase tracking-[0.28em] text-white/45 sm:block">
                Private Catalog
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/#catalog"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/35 hover:text-white"
            >
              Catalog
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#d9d9d9]"
            >
              Admin
            </Link>
          </nav>
        </div>

        <form action="/" className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
          />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search product name, brand, or product code"
            className="h-12 w-full rounded-full border border-white/10 bg-[#121212] px-11 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35"
          />
        </form>
      </div>
    </header>
  );
}
