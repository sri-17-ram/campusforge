import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return Response.json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    return Response.json({
      success: true,
      user,
      message: "User Registered Successfully",
    });

  } catch (error) {
  console.error("Registration Error:", error);

  return Response.json({
    success: false,
    message: "Registration Failed",
    error: String(error),
  });
}
}