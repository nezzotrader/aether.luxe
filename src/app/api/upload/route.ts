import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

type UploadResult = {
  secure_url: string;
};

async function uploadBuffer(buffer: Buffer, folder: string) {
  return new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result as UploadResult);
      },
    );

    stream.end(buffer);
  });
}

function hasPlaceholderCloudinaryConfig() {
  return [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ].some((value) => !value || value.startsWith("your_"));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (
    hasPlaceholderCloudinaryConfig()
  ) {
    return NextResponse.json(
      { message: "Cloudinary credentials are missing or still using placeholders." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File);

  if (!files.length) {
    return NextResponse.json(
      { message: "Please upload at least one image." },
      { status: 400 },
    );
  }

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await uploadBuffer(Buffer.from(arrayBuffer), "aether-luxe");
        return result.secure_url;
      }),
    );

    return NextResponse.json({ images: uploads });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Cloudinary upload failed. Check your Cloudinary API keys.",
      },
      { status: 500 },
    );
  }
}
