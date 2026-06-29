import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { getServerSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ success: false, message: "File URL is required" }, { status: 400 });
    }

    // Extract secure key from the URL
    // Format: https://bucket.s3.region.amazonaws.com/secureKey
    const bucketDomain = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    
    if (!fileUrl.startsWith(bucketDomain)) {
      return NextResponse.json({ success: false, message: "Invalid AWS S3 URL" }, { status: 400 });
    }

    const secureKey = fileUrl.replace(bucketDomain, "");

    // Basic Security: Only allow users to delete files under their own directory
    if (!secureKey.startsWith(`${decoded.id}/`)) {
      return NextResponse.json({ success: false, message: "Forbidden: You do not own this file" }, { status: 403 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: secureKey,
    });

    await s3.send(command);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully from AWS S3",
    });
  } catch (error) {
    console.error("AWS S3 Delete Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete file from S3" }, { status: 500 });
  }
}
