import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getCategories, serializeCategory } from "@/lib/categories";
import { connectToDatabase } from "@/lib/db";
import { categorySchema } from "@/lib/validators";
import { CategoryModel } from "@/models/Category";

export const runtime = "nodejs";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = categorySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid category." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const category = await CategoryModel.create(parsed.data);
  return NextResponse.json(
    { category: serializeCategory(category.toObject()) },
    { status: 201 },
  );
}
