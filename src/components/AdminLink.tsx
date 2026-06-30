"use client";

import Link from "next/link";
import { ShieldUser } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminLink() {
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPendingOrders() {
      try {
        const response = await fetch("/api/orders/pending-count", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (active) {
            setPendingOrders(0);
          }
          return;
        }

        const data = (await response.json()) as { pendingOrders?: number };

        if (active) {
          setPendingOrders(data.pendingOrders || 0);
        }
      } catch {
        if (active) {
          setPendingOrders(0);
        }
      }
    }

    loadPendingOrders();
    const interval = window.setInterval(loadPendingOrders, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Link
      href="/admin"
      className="relative inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:border-white/35 hover:text-white md:px-3"
    >
      <ShieldUser className="size-4" aria-hidden="true" />
      <span className="hidden md:inline">Admin</span>
      {pendingOrders ? (
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-[#d4af37] text-[10px] font-bold text-black">
          {pendingOrders > 9 ? "9+" : pendingOrders}
        </span>
      ) : null}
    </Link>
  );
}
