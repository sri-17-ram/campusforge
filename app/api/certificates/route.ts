import { prisma } from "@/lib/prisma";
import { verifyToken, getServerSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
    if (!student) {
      return Response.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
    if (!student) {
      return Response.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body.title || !body.issuer || !body.fileUrl) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const certificate = await prisma.certificate.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        fileUrl: body.fileUrl,
        studentId: student.id,
      },
    });

    // Generate Activity
    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: "Uploaded Certificate",
        details: body.title,
      }
    });

    // Generate Notification
    await prisma.notification.create({
      data: {
        userId: decoded.id,
        title: "Certificate Uploaded",
        message: `Your certificate "${body.title}" has been added to your profile.`
      }
    });

    // Update Profile Score
    const newScore = student.score ? student.score + 5 : 5;
    await prisma.student.update({
      where: { id: student.id },
      data: { score: Math.min(100, newScore) }
    });

    return Response.json({
      success: true,
      message: "Certificate saved successfully",
      certificate,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to save certificate" }, { status: 500 });
  }
}