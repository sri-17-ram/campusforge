import { prisma } from "@/lib/prisma";

// Get all certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany();

    return Response.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch certificates",
      },
      { status: 500 }
    );
  }
}

// Create a certificate
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const certificate = await prisma.certificate.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        userId: body.userId,
      },
    });

    return Response.json({
      success: true,
      certificate,
      message: "Certificate Added Successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Certificate Creation Failed",
      },
      { status: 500 }
    );
  }
}