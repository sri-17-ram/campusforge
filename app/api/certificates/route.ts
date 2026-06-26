import { prisma } from "@/lib/prisma";

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
      message: "Certificate Added Successfully",
      certificate,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to Add Certificate",
    });
  }
}

export async function GET() {
  const certificates = await prisma.certificate.findMany();

  return Response.json({
    success: true,
    certificates,
  });
}