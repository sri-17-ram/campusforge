import { prisma } from "@/lib/prisma";

// Get all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany();

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

// Create a new project
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        domain: body.domain,
        requiredSkills: body.requiredSkills,
      },
    });

    return Response.json({
      success: true,
      project,
      message: "Project Created Successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Project Creation Failed",
      },
      { status: 500 }
    );
  }
}