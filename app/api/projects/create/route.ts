import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: decoded.id }
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile required" }, { status: 400 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      github, 
      demo, 
      imageUrl, 
      projectFileUrl, 
      projectFileName, 
      projectFileSize, 
      projectFileType, 
      techStack 
    } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        github,
        demo,
        imageUrl,
        projectFileUrl,
        projectFileName,
        projectFileSize,
        projectFileType,
        techStack,
        projectUpdatedAt: projectFileUrl ? new Date() : null,
        studentId: student.id
      }
    });

    return NextResponse.json({
      success: true,
      project,
      message: "Project Created Successfully",
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return NextResponse.json({ success: false, message: "Failed to create project" }, { status: 500 });
  }
}