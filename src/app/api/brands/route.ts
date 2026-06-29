import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getBrands, serializeBrand } from "@/lib/brands";
import { brandSchema } from "@/lib/validators";
import { BrandModel } from "@/models/Brand";

export const runtime = "nodejs";

export async function GET() {
  const brands = await getBrands();
  return NextResponse.json({ brands });
}

export async function POST(request: Request) {
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

  await connectToDatabase();
  const brand = await BrandModel.create(parsed.data);
  return NextResponse.json({ brand: serializeBrand(brand.toObject()) }, { status: 201 });
}
