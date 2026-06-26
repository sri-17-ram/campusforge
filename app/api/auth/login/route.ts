import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      return Response.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        user,
        message: "Login Successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Login Failed",
      },
      { status: 500 }
    );
  }
}