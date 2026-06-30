export const DEFAULT_BRANDS = [
  "Louis Vuitton",
  "Christian Louboutin",
  "Chrome Hearts",
  "Chanel",
  "Dior",
  "Hermes",
  "Gucci",
  "Prada",
  "Balenciaga",
  "Saint Laurent",
  "Fendi",
  "Givenchy",
  "Bottega Veneta",
  "Polo Ralph Lauren",
  "Burberry",
] as const;

export const CATEGORIES = [
  "Bags",
  "Wallets",
  "Shirts",
  "Pants",
  "Sweaters",
  "Shoes",
  "Accessories",
  "Watches",
] as const;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
] as const;

export const PRODUCTS_PER_PAGE = 12;
export const CURRENCY = "MYR";
export const PAYMENT_METHODS = ["qr", "stripe"] as const;
export const SHIPPING_COUNTRIES = [
  "Malaysia",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Cambodia",
  "Laos",
  "Japan",
  "Korea",
  "Australia",
  "New Zealand",
  "US",
  "Canada",
  "Georgia",
  "Armenia",
  "Kazakhstan",
  "Kyrgyzstan",
  "Uzbekistan",
  "Tajikistan",
  "Mongolia",
] as const;

export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

export const SHIPPING_OPTIONS: Record<ShippingCountry, number> = {
  Malaysia: 15,
  Singapore: 30,
  Thailand: 45,
  Vietnam: 45,
  Cambodia: 45,
  Laos: 45,
  Japan: 70,
  Korea: 70,
  Australia: 85,
  "New Zealand": 85,
  US: 115,
  Canada: 115,
  Georgia: 120,
  Armenia: 120,
  Kazakhstan: 120,
  Kyrgyzstan: 120,
  Uzbekistan: 120,
  Tajikistan: 120,
  Mongolia: 120,
};
