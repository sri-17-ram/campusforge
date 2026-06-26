import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: "STUDENT",
      },
    });

    return Response.json({
      success: true,
      user,
      message: "User Registered Successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Registration Failed",
      error,
    });
  }
}