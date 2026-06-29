import { BadgeCheck, Clock, PackageCheck, Truck } from "lucide-react";
import Link from "next/link";

const FOOTER_ITEMS = [
  { title: "Curated Quality", body: "Checked catalog items", icon: BadgeCheck },
  { title: "Preorder 5-9 Days", body: "Clear delivery window", icon: Clock },
  { title: "Secure Checkout", body: "QR receipt or Stripe", icon: PackageCheck },
  { title: "Tracked Delivery", body: "Owner confirms orders", icon: Truck },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090606]">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {FOOTER_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3 text-white/70">
              <Icon className="size-5 text-[#d7d7d7]" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  {item.title}
                </p>
                <p className="text-xs text-white/45">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs uppercase tracking-[0.22em] text-white/35">
        <Link href="/orders" className="transition hover:text-white">
          Order History
        </Link>
        <span className="mx-3">/</span>
        Aether Luxe by Azfar
      </div>
    </footer>
  );
}
