import { PRODUCTS_PER_PAGE } from "./constants";
import { connectToDatabase, hasDatabaseConfig } from "./db";
import { ProductModel } from "@/models/Product";
import type { Product } from "@/types/product";

type ProductDocument = {
  _id: { toString: () => string };
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  productCode: string;
  images: string[];
  createdAt: Date;
};

export type ProductQuery = {
  search?: string;
  brand?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export function serializeProduct(product: ProductDocument): Product {
  return {
    _id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    description: product.description,
    productCode: product.productCode,
    images: product.images,
    createdAt: product.createdAt.toISOString(),
  };
}

function getSort(sort?: string): Record<string, 1 | -1> {
  if (sort === "price-asc") {
    return { price: 1, createdAt: -1 };
  }

  if (sort === "price-desc") {
    return { price: -1, createdAt: -1 };
  }

  return { createdAt: -1 };
}

export async function getProducts(query: ProductQuery = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const perPage = Math.max(Number(query.limit || PRODUCTS_PER_PAGE), 1);

  if (!hasDatabaseConfig()) {
    return {
      products: [],
      total: 0,
      page,
      pages: 1,
    };
  }

  await connectToDatabase();

  const filter: Record<string, unknown> = {};

  if (query.search) {
    const safeSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { brand: { $regex: safeSearch, $options: "i" } },
      { productCode: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (query.brand) {
    filter.brand = query.brand;
  }

  if (query.category) {
    filter.category = query.category;
  }

  const [items, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(getSort(query.sort))
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean<ProductDocument[]>(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products: items.map(serializeProduct),
    total,
    page,
    pages: Math.max(Math.ceil(total / perPage), 1),
  };
}

export async function getProductById(id: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  await connectToDatabase();
  const product = await ProductModel.findById(id).lean<ProductDocument | null>();
  return product ? serializeProduct(product) : null;
}
