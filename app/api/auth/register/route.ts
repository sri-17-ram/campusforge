import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return Response.json(
        {
          success: false,
          message: "Name and Email are required",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: "STUDENT",
      },
    });

    return Response.json(
      {
        success: true,
        user,
        message: "User Registered Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Registration Failed",
      },
      { status: 500 }
    );
  }
}