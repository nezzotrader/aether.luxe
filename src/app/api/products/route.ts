import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getProducts, serializeProduct } from "@/lib/products";
import { productSchema } from "@/lib/validators";
import { ProductModel } from "@/models/Product";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await getProducts({
    search: searchParams.get("search") || "",
    brand: searchParams.get("brand") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || 1),
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid product." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const product = await ProductModel.create(parsed.data);

  return NextResponse.json(
    { product: serializeProduct(product.toObject()) },
    { status: 201 },
  );
}
