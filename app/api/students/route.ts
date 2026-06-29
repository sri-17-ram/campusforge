import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        skills: true,
      }
    });

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: s.user.name || 'Unknown',
      department: s.branch || 'Computer Science',
      skills: s.skills.map(sk => sk.name),
      matchPercentage: s.score || 50,
      availability: 'Full-time',
    }));

    return NextResponse.json({ success: true, students: formattedStudents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch students" }, { status: 500 });
  }
}
