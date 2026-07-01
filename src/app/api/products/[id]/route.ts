import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeProduct } from "@/lib/products";
import { productSchema } from "@/lib/validators";
import { ProductModel } from "@/models/Product";

export const runtime = "nodejs";

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: ProductRouteContext) {
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

  const { id } = await context.params;
  await connectToDatabase();
  const { productCode, ...productData } = parsed.data;
  const update = productCode ? { ...productData, productCode } : productData;

  const product = await ProductModel.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product: serializeProduct(product.toObject()) });
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await connectToDatabase();
  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
