"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type MobileMenuProps = {
  navItems: {
    label: string;
    href: string;
  }[];
};

export function MobileMenu({ navItems }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-md border border-white/10 text-white/85 transition hover:border-white/35 hover:text-white"
        aria-label="Open navigation menu"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[#070102] px-6 py-6 text-white">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-md border border-white/10 text-white/85"
            aria-label="Close navigation menu"
          >
            <X className="size-7" aria-hidden="true" />
          </button>

          <div className="mt-14">
            <p className="text-xs uppercase tracking-[0.35em] text-white/35">
              Aether Luxe
            </p>
            <nav className="mt-8 grid gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-5xl font-semibold uppercase leading-none tracking-[0.06em] text-white transition hover:text-[#d4af37]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
