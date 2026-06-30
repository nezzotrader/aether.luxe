import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPendingOrderCount } from "@/lib/orders";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ pendingOrders: 0 }, { status: 200 });
  }

  const pendingOrders = await getPendingOrderCount();
  return NextResponse.json({ pendingOrders });
}
