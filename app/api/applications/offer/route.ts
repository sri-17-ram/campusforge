import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") return NextResponse.json({ success: false }, { status: 401 });

    const body = await req.json();
    const { applicationId, action } = body; // action: 'ACCEPT' or 'DECLINE'

    if (!applicationId || !['ACCEPT', 'DECLINE'].includes(action)) {
      return NextResponse.json({ success: false, message: "Invalid request parameters" }, { status: 400 });
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: { include: { recruiter: true } }, student: { include: { user: true } } }
    });

    if (!application || application.student.userId !== decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized or not found" }, { status: 403 });
    }

    if (application.status !== 'OFFER') {
      return NextResponse.json({ success: false, message: "No offer extended yet" }, { status: 400 });
    }

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED'; // REJECTED by student

    const updatedApp = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: newStatus }
    });

    // Notify Recruiter
    if (application.job.recruiter?.userId) {
      await prisma.notification.create({
        data: {
          userId: application.job.recruiter.userId,
          title: `Offer ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
          message: `${(decoded as any).name || 'A student'} has ${action === 'ACCEPT' ? 'accepted' : 'declined'} your offer for ${application.job.title}`
        }
      });
    }

    // Log Activity for Student
    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: `Offer ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
        details: application.job.title
      }
    });

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to process offer response" }, { status: 500 });
  }
}
