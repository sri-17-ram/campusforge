import { prisma } from "@/lib/prisma";

// Get all applications
export async function GET() {
  try {
    const applications = await prisma.application.findMany();

    return Response.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
}

// Create a new application
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const application = await prisma.application.create({
      data: {
        company: body.company,
        position: body.position,
        status: body.status,
        userId: body.userId,
      },
    });

    return Response.json({
      success: true,
      application,
      message: "Application Created Successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Application Creation Failed",
      },
      { status: 500 }
    );
  }
}