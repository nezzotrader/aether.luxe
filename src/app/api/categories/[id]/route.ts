import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { serializeCategory } from "@/lib/categories";
import { connectToDatabase } from "@/lib/db";
import { categorySchema } from "@/lib/validators";
import { CategoryModel } from "@/models/Category";

export const runtime = "nodejs";

type CategoryRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: CategoryRouteContext) {
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

  const { id } = await context.params;
  await connectToDatabase();
  const category = await CategoryModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return NextResponse.json(
      { message: "Category not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    category: serializeCategory(category.toObject()),
  });
}

export async function DELETE(_request: Request, context: CategoryRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await connectToDatabase();
  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
