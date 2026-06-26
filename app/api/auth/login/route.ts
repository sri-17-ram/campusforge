import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/jwt";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if email exists
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return Response.json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return Response.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return Response.json({
      success: false,
      message: "Login Failed",
    });
  }
}