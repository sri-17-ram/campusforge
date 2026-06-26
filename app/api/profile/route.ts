import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const profile = await prisma.profile.create({
      data: {
        userId: body.userId,
        department: body.department,
        year: body.year,
        github: body.github,
        linkedin: body.linkedin,
        skills: body.skills,
      },
    });

    return Response.json({
      success: true,
      profile,
      message: "Profile Created Successfully",
    });

  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Profile Creation Failed",
      error,
    });
  }
}