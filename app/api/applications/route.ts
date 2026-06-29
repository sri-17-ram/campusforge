import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
    if (!student) {
      return Response.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: body.jobId,
        studentId: student.id,
      },
      include: { job: { include: { recruiter: true } } }
    });

    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: "Applied for Job",
        details: application.job.title
      }
    });

    await prisma.notification.create({
      data: {
        userId: decoded.id,
        title: "Application Submitted",
        message: `You applied for ${application.job.title}`
      }
    });

    if (application.job.recruiter?.userId) {
      await prisma.notification.create({
        data: {
          userId: application.job.recruiter.userId,
          title: "New Application Received",
          message: `${(decoded as any).name || 'A student'} applied for ${application.job.title}`
        }
      });
    }

    return Response.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Application Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "RECRUITER") return Response.json({ success: false }, { status: 401 });

    const body = await req.json();
    if (!body.applicationId || !body.status) return Response.json({ success: false }, { status: 400 });

    const recruiter = await prisma.recruiter.findUnique({ where: { userId: decoded.id } });
    if (!recruiter) return Response.json({ success: false }, { status: 404 });

    const application = await prisma.jobApplication.findUnique({
      where: { id: body.applicationId },
      include: { job: true, student: { include: { user: true } } }
    });

    if (!application || application.job.recruiterId !== recruiter.id) {
      return Response.json({ success: false }, { status: 403 });
    }

    const updatedApp = await prisma.jobApplication.update({
      where: { id: body.applicationId },
      data: { status: body.status }
    });

    await prisma.notification.create({
      data: {
        userId: application.student.user.id,
        title: "Application Update",
        message: `Your application for ${application.job.title} was marked as ${body.status}`
      }
    });

    return Response.json({ success: true, application: updatedApp });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Status Update Failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let applications;

    if (decoded.role === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { userId: decoded.id } });
      if (student) {
        applications = await prisma.jobApplication.findMany({
          where: { studentId: student.id },
          include: { job: { include: { recruiter: { include: { user: true } } } } },
        });
      }
    } else if (decoded.role === "RECRUITER") {
      const recruiter = await prisma.recruiter.findUnique({ where: { userId: decoded.id } });
      if (recruiter) {
        applications = await prisma.jobApplication.findMany({
          where: { job: { recruiterId: recruiter.id } },
          include: { student: { include: { user: true } }, job: true },
        });
      }
    } else {
      applications = await prisma.jobApplication.findMany({
        include: { job: true, student: { include: { user: true } } },
      });
    }

    return Response.json({
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") return Response.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return Response.json({ success: false, message: "Missing application ID" }, { status: 400 });

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: { include: { recruiter: true } }, student: { include: { user: true } } }
    });

    if (!application || application.student.userId !== decoded.id) {
      return Response.json({ success: false, message: "Application not found or unauthorized" }, { status: 403 });
    }

    await prisma.jobApplication.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: "Withdrew Application",
        details: application.job.title
      }
    });

    if (application.job.recruiter?.userId) {
      await prisma.notification.create({
        data: {
          userId: application.job.recruiter.userId,
          title: "Application Withdrawn",
          message: `${(decoded as any).name || 'A student'} withdrew their application for ${application.job.title}`
        }
      });
    }

    return Response.json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to withdraw application" }, { status: 500 });
  }
}
