import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const application = await prisma.application.create({
    data: {
      company: body.company,
      position: body.position,
      status: "Applied",
      userId: body.userId,
    },
  });

  return Response.json({
    success: true,
    application,
  });
}

export async function GET() {
  const applications = await prisma.application.findMany();

  return Response.json({
    success: true,
    applications,
  });
}