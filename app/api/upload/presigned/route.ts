import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";
import { getServerSession } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ success: false, message: "Filename and contentType are required" }, { status: 400 });
    }

    // Security: Restrict allowed MIME types
    const allowedTypes = [
      "application/pdf", 
      "image/png", 
      "image/jpeg", 
      "image/jpg", 
      "image/webp",
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.rar",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
      "text/plain"
    ];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ success: false, message: "Invalid file type" }, { status: 400 });
    }

    // Generate secure randomized key to prevent collisions
    const fileExtension = filename.split(".").pop();
    const secureKey = `${decoded.id}/${randomUUID()}-${Date.now()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: secureKey,
      ContentType: contentType,
    });

    // Generate Pre-signed URL valid for 5 minutes
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const finalUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${secureKey}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      finalUrl,
      secureKey,
    });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ success: false, message: "Failed to generate presigned URL" }, { status: 500 });
  }
}
