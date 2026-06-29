import { DEFAULT_BRANDS } from "./constants";
import { connectToDatabase, hasDatabaseConfig } from "./db";
import { BrandModel } from "@/models/Brand";
import type { Brand } from "@/types/product";

type BrandDocument = {
  _id: { toString: () => string };
  name: string;
  isActive?: boolean;
  createdAt: Date;
};

export function serializeBrand(brand: BrandDocument): Brand {
  return {
    _id: brand._id.toString(),
    name: brand.name,
    isActive: brand.isActive ?? true,
    createdAt: brand.createdAt.toISOString(),
  };
}

export async function ensureDefaultBrands() {
  if (!hasDatabaseConfig()) {
    return;
  }

  await connectToDatabase();
  const existingBrands = await BrandModel.estimatedDocumentCount();

  if (existingBrands > 0) {
    return;
  }

  await Promise.all(
    DEFAULT_BRANDS.map((name) =>
      BrandModel.updateOne(
        { name },
        { $setOnInsert: { name, isActive: true } },
        { upsert: true },
      ),
    ),
  );
}

export async function getBrands({ activeOnly = false } = {}) {
  if (!hasDatabaseConfig()) {
    return DEFAULT_BRANDS.map((name, index) => ({
      _id: `default-${index}`,
      name,
      isActive: true,
      createdAt: new Date(0).toISOString(),
    }));
  }

  await ensureDefaultBrands();
  const filter = activeOnly ? { isActive: true } : {};
  const brands = await BrandModel.find(filter).sort({ name: 1 }).lean<BrandDocument[]>();
  return brands.map(serializeBrand);
}
