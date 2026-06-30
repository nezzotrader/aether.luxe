import { PRODUCTS_PER_PAGE } from "./constants";
import { connectToDatabase, hasDatabaseConfig } from "./db";
import { OrderModel } from "@/models/Order";
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
  colors?: string[];
  sizes?: string[];
  customOptions?: Product["customOptions"];
  soldCount?: number;
  isActive?: boolean;
  createdAt: Date;
};

export type ProductQuery = {
  search?: string;
  brand?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  activeOnly?: boolean;
};

export function serializeProduct(
  product: ProductDocument,
  soldCount = product.soldCount || 0,
): Product {
  return {
    _id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    description: product.description,
    productCode: product.productCode,
    images: product.images,
    colors: product.colors || [],
    sizes: product.sizes || [],
    customOptions: product.customOptions || [],
    soldCount,
    isActive: product.isActive ?? true,
    createdAt: product.createdAt.toISOString(),
  };
}

async function getSoldCounts(productIds: string[]) {
  if (!productIds.length) {
    return new Map<string, number>();
  }

  const rows = await OrderModel.aggregate<{
    _id: string;
    soldCount: number;
  }>([
    { $match: { paymentStatus: "confirmed" } },
    { $unwind: "$items" },
    { $match: { "items.productId": { $in: productIds } } },
    {
      $group: {
        _id: "$items.productId",
        soldCount: { $sum: "$items.quantity" },
      },
    },
  ]);

  return new Map(rows.map((row) => [row._id, row.soldCount]));
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

  if (query.activeOnly) {
    filter.isActive = { $ne: false };
  }

  const [items, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(getSort(query.sort))
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean<ProductDocument[]>(),
    ProductModel.countDocuments(filter),
  ]);

  const productIds = items.map((item) => item._id.toString());
  const soldCounts = await getSoldCounts(productIds);

  return {
    products: items.map((item) =>
      serializeProduct(item, soldCounts.get(item._id.toString()) || 0),
    ),
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
  if (!product) {
    return null;
  }

  const soldCounts = await getSoldCounts([product._id.toString()]);
  return serializeProduct(product, soldCounts.get(product._id.toString()) || 0);
}
