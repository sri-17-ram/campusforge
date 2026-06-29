import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "FACULTY") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [
      totalStudents,
      studentsWithResume,
      verifiedCertificates,
      pendingCertificates,
      projectsSubmitted,
      projectsPendingReview,
      placementReadyStudents,
      totalApplications,
      activities
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { resume: { not: null } } }),
      prisma.certificate.count({ where: { status: "APPROVED" } }),
      prisma.certificate.count({ where: { status: "PENDING" } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: "PENDING" } }),
      prisma.student.count({ where: { isPlacementReady: true } }),
      prisma.jobApplication.count(),
      prisma.activity.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatar: true } } }
      })
    ]);

    // Gather data for charts
    const studentsByDepartmentRaw = await prisma.student.groupBy({
      by: ['branch'],
      _count: { id: true },
    });
    const studentsByDepartment = studentsByDepartmentRaw
      .filter(s => s.branch)
      .map(s => ({
        name: s.branch,
        value: s._count.id
      }));

    const topSkillsRaw = await prisma.skill.groupBy({
      by: ['name'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });
    const topSkills = topSkillsRaw.map(s => ({
      name: s.name,
      value: s._count.id
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        studentsWithResume,
        studentsWithoutResume: totalStudents - studentsWithResume,
        verifiedCertificates,
        pendingCertificates,
        projectsSubmitted,
        projectsPendingReview,
        placementReadyStudents,
        totalApplications,
        averageProfileCompletion: 85 // Mocked for simplicity, could be derived from actual data
      },
      charts: {
        studentsByDepartment,
        topSkills,
      },
      activities
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
