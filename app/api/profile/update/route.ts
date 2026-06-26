import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const profile = await prisma.profile.upsert({
      where: {
        userId: body.userId,
      },
      update: {
        department: body.department,
        year: body.year,
        github: body.github,
        linkedin: body.linkedin,
        skills: body.skills,
      },
      create: {
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
      message: "Profile Saved Successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Failed to Save Profile",
    });
  }
}