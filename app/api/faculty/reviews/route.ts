import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "FACULTY") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [pendingProjects, pendingCertificates] = await Promise.all([
      prisma.project.findMany({
        include: { student: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.certificate.findMany({
        include: { student: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return NextResponse.json({
      success: true,
      pendingProjects,
      pendingCertificates
    });

  } catch (error) {
    console.error("Reviews GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "FACULTY") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, id, status, rating, comments, studentId } = body;

    let targetStudentId = studentId;
    let targetName = "";

    if (type === "PROJECT") {
      const p = await prisma.project.update({
        where: { id },
        data: {
          status,
          rating,
          reviewComment: comments,
          reviewedById: decoded.id,
          reviewedAt: new Date()
        }
      });
      targetStudentId = p.studentId;
      targetName = `Project '${p.title}'`;
    } else if (type === "CERTIFICATE") {
      const c = await prisma.certificate.update({
        where: { id },
        data: {
          status,
          remarks: comments,
          verifiedById: decoded.id,
          verifiedAt: new Date()
        }
      });
      targetStudentId = c.studentId;
      targetName = `Certificate '${c.title}'`;
    } else if (type === "RESUME") {
      await prisma.student.update({
        where: { id },
        data: {
          resumeStatus: status,
          resumeRating: rating,
          resumeFeedback: comments
        }
      });
      targetStudentId = id;
      targetName = "Resume";
    } else if (type === "PROFILE") {
      await prisma.student.update({
        where: { id },
        data: {
          profileRating: rating,
          profileFeedback: comments
        }
      });
      targetStudentId = id;
      targetName = "Profile";
    }

    if (targetStudentId) {
      const st = await prisma.student.findUnique({ where: { id: targetStudentId } });
      if (st) {
        let notificationTitle = `${targetName} Reviewed`;
        let notificationMessage = `A faculty member has reviewed your ${targetName}.`;

        if (status === 'APPROVED') {
          notificationTitle = `${targetName} Approved`;
          notificationMessage = `Congratulations! Your ${targetName} has been approved by Faculty.`;
        } else if (status === 'REJECTED') {
          notificationTitle = `${targetName} Rejected`;
          notificationMessage = `Your ${targetName} requires changes. Please review the Faculty feedback.`;
        } else if (rating > 0) {
           notificationTitle = `New Rating on ${targetName}`;
           notificationMessage = `Faculty assigned a ${rating}-star rating to your ${targetName}.`;
        }

        if (comments) {
          notificationMessage += `\nFaculty Comment: "${comments}"`;
        }

        await prisma.notification.create({
          data: {
            userId: st.userId,
            title: notificationTitle,
            message: notificationMessage
          }
        });
        await prisma.activity.create({
          data: {
            userId: decoded.id,
            action: `Reviewed ${targetName}`,
            details: `Status: ${status || 'Reviewed'} ${rating ? `| Rating: ${rating}` : ''}`
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: "Review saved successfully" });

  } catch (error) {
    console.error("Reviews PUT Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
