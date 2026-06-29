import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    qrPaymentImageUrl:
      process.env.QR_PAYMENT_IMAGE_URL ||
      process.env.NEXT_PUBLIC_QR_PAYMENT_IMAGE_URL ||
      "",
  });
}
