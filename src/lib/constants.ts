export const BRANDS = [
  "Louis Vuitton",
  "Christian Louboutin",
  "Chrome Hearts",
  "Chanel",
  "Dior",
  "Hermès",
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
export const ORDER_FORM_URL = "https://forms.gle/fT4yjSWAr6rvnaNh6";
