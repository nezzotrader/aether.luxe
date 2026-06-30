import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanUrl(value?: string) {
  return (value || "").trim().replace(/^['"]|['"]$/g, "");
}

export async function GET() {
  return NextResponse.json({
    qrPaymentImageUrl: cleanUrl(
      process.env.QR_PAYMENT_IMAGE_URL ||
        process.env.NEXT_PUBLIC_QR_PAYMENT_IMAGE_URL,
    ),
  });
}
