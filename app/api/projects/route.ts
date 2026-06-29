import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true, // Only fetch small description, omit massive body if there is one
        imageUrl: true,
        techStack: true,
        github: true,
        demo: true,
        createdAt: true,
        student: {
          select: {
            user: { select: { name: true, avatar: true } }
          }
        }
      }
    };

    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1; // Skip the cursor itself
    }

    const projects = await prisma.project.findMany(query);

    const nextCursor = projects.length === limit ? projects[projects.length - 1].id : null;

    return NextResponse.json({
      success: true,
      projects,
      nextCursor
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, imageUrl, github, demo, techStack } = body;

    const student = await prisma.student.findUnique({
      where: { userId: decoded.id },
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        github,
        demo,
        techStack: techStack || '',
        studentId: student.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Project Creation Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}