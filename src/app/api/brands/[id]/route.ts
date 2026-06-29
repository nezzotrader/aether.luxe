import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeBrand } from "@/lib/brands";
import { brandSchema } from "@/lib/validators";
import { BrandModel } from "@/models/Brand";

export const runtime = "nodejs";

type BrandRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: BrandRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = brandSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid brand." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  await connectToDatabase();
  const brand = await BrandModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    return NextResponse.json({ message: "Brand not found." }, { status: 404 });
  }

  return NextResponse.json({ brand: serializeBrand(brand.toObject()) });
}

export async function DELETE(_request: Request, context: BrandRouteContext) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await connectToDatabase();
  const brand = await BrandModel.findByIdAndDelete(id);

  if (!brand) {
    return NextResponse.json({ message: "Brand not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
