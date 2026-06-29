import { prisma } from "@/lib/prisma";
import { verifyToken, getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "STUDENT") return NextResponse.json({ success: false }, { status: 401 });

    const body = await req.json();
    const { interviewId, action } = body; // action: 'ACCEPT' or 'REJECT'

    if (!interviewId || !['ACCEPT', 'REJECT'].includes(action)) {
      return NextResponse.json({ success: false, message: "Invalid request parameters" }, { status: 400 });
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { application: { include: { job: { include: { recruiter: true } }, student: true } } }
    });

    if (!interview || interview.application.student.userId !== decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized or not found" }, { status: 403 });
    }

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: { status: newStatus }
    });

    // Notify Recruiter
    if (interview.application.job.recruiter?.userId) {
      await prisma.notification.create({
        data: {
          userId: interview.application.job.recruiter.userId,
          title: `Interview ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
          message: `${(decoded as any).name || 'A student'} has ${action === 'ACCEPT' ? 'accepted' : 'declined'} the interview for ${interview.application.job.title} (Round ${interview.round})`
        }
      });
    }

    // Log Activity for Student
    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: `Interview ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
        details: `Round ${interview.round} for ${interview.application.job.title}`
      }
    });

    return NextResponse.json({ success: true, interview: updatedInterview });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to process interview response" }, { status: 500 });
  }
}
