import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Get Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message: "No token provided",
        },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Verify JWT
    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    // Read request body
    const body = await req.json();

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: body.userId,
      },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: {
          userId: body.userId,
        },
        data: {
          department: body.department,
          year: body.year,
          github: body.github,
          linkedin: body.linkedin,
          skills: body.skills,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId: body.userId,
          department: body.department,
          year: body.year,
          github: body.github,
          linkedin: body.linkedin,
          skills: body.skills,
        },
      });
    }

    return Response.json({
      success: true,
      message: "Profile Saved Successfully",
      profile,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    return Response.json(
      {
        success: false,
        message: "Profile Save Failed",
      },
      { status: 500 }
    );
  }
}