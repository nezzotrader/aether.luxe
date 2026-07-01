import { CATEGORIES } from "./constants";
import { connectToDatabase, hasDatabaseConfig } from "./db";
import { CategoryModel } from "@/models/Category";
import type { Category } from "@/types/product";

type CategoryDocument = {
  _id: { toString: () => string };
  name: string;
  isActive?: boolean;
  createdAt: Date;
};

export function serializeCategory(category: CategoryDocument): Category {
  return {
    _id: category._id.toString(),
    name: category.name,
    isActive: category.isActive ?? true,
    createdAt: category.createdAt.toISOString(),
  };
}

export async function ensureDefaultCategories() {
  if (!hasDatabaseConfig()) {
    return;
  }

  await connectToDatabase();
  const existingCategories = await CategoryModel.estimatedDocumentCount();

  if (existingCategories > 0) {
    return;
  }

  await Promise.all(
    CATEGORIES.map((name) =>
      CategoryModel.updateOne(
        { name },
        { $setOnInsert: { name, isActive: true } },
        { upsert: true },
      ),
    ),
  );
}

export async function getCategories({ activeOnly = false } = {}) {
  if (!hasDatabaseConfig()) {
    return CATEGORIES.map((name, index) => ({
      _id: `default-category-${index}`,
      name,
      isActive: true,
      createdAt: new Date(0).toISOString(),
    }));
  }

  await ensureDefaultCategories();
  const filter = activeOnly ? { isActive: true } : {};
  const categories = await CategoryModel.find(filter)
    .sort({ name: 1 })
    .lean<CategoryDocument[]>();
  return categories.map(serializeCategory);
}
