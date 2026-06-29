import { prisma } from "@/lib/prisma";
import { verifyToken, getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") return NextResponse.json({ success: false }, { status: 401 });

    const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
    if (!student) return NextResponse.json({ success: false }, { status: 404 });

    const skills = await prisma.skill.findMany({
      where: { studentId: student.id }
    });

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") return NextResponse.json({ success: false }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: "Skill name required" }, { status: 400 });

    const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
    if (!student) return NextResponse.json({ success: false }, { status: 404 });

    const skill = await prisma.skill.create({
      data: {
        name,
        studentId: student.id
      }
    });

    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: "Added Skill",
        details: name
      }
    });

    // Update Profile Score
    const newScore = student.score ? student.score + 2 : 2;
    await prisma.student.update({
      where: { id: student.id },
      data: { score: Math.min(100, newScore) }
    });

    return NextResponse.json({ success: true, message: "Skill added", data: skill });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to add skill" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: "No ID" }, { status: 400 });

    const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
    if (!student) return NextResponse.json({ success: false }, { status: 404 });

    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill || skill.studentId !== student.id) return NextResponse.json({ success: false }, { status: 403 });

    await prisma.skill.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Skill deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Deletion Failed" }, { status: 500 });
  }
}
