import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

type UploadResult = {
  secure_url: string;
};

function hasPlaceholderCloudinaryConfig() {
  return [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ].some((value) => !value || value.startsWith("your_"));
}

async function uploadBuffer(buffer: Buffer) {
  return new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aether-luxe/receipts",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Receipt upload failed."));
          return;
        }

        resolve(result as UploadResult);
      },
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  if (hasPlaceholderCloudinaryConfig()) {
    return NextResponse.json(
      { message: "Cloudinary credentials are missing or still using placeholders." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("receipt");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Please attach a payment receipt image." },
      { status: 400 },
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await uploadBuffer(Buffer.from(arrayBuffer));
    return NextResponse.json({ receiptUrl: result.secure_url });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Receipt upload failed. Check your Cloudinary API keys.",
      },
      { status: 500 },
    );
  }
}
