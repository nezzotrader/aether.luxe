import { BadgeCheck, Clock, PackageCheck, Truck } from "lucide-react";

const FOOTER_ITEMS = [
  { title: "Curated Quality", body: "Checked catalog items", icon: BadgeCheck },
  { title: "Preorder 5-9 Days", body: "Clear delivery window", icon: Clock },
  { title: "Secure Checkout", body: "QR receipt or Stripe", icon: PackageCheck },
  { title: "Tracked Delivery", body: "Owner confirms orders", icon: Truck },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aether.luxe__?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aether.luxe_?is_from_webapp=1&sender_device=pc",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@aether.luxe_",
  },
];

const POLICY_ITEMS = ["Privacy Policy", "Refund Policy", "Shipping Policy"];

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
      <div className="border-t border-white/10 px-4 py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Social
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 sm:justify-start">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase tracking-[0.18em] text-white/72 transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:text-right">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-white/35 sm:justify-end">
              {POLICY_ITEMS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/28">
              (c) 2026 Aether Luxe
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
