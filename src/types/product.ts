export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  productCode: string;
  images: string[];
  createdAt: string;
};

export type ProductPayload = Omit<Product, "_id" | "createdAt">;
