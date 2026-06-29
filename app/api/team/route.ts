import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch students looking for teams, optimized with select
    const students = await prisma.student.findMany({
      take: limit,
      where: {
        // You can add filters here, e.g., isPlacementReady: true, etc.
      },
      select: {
        id: true,
        branch: true,
        year: true,
        bio: true,
        skills: {
          select: { name: true }
        },
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: s.user.name,
      avatar: s.user.avatar,
      department: s.branch || 'Unknown',
      year: s.year,
      bio: s.bio,
      skills: s.skills.map(skill => skill.name)
    }));

    return NextResponse.json({ success: true, students: formattedStudents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to load candidates" }, { status: 500 });
  }
}