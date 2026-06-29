import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    const filter: any = {};
    if (startDate && endDate) {
      filter.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const interviews = await prisma.interview.findMany({
      where: filter,
      include: {
        application: {
          include: {
            student: {
              include: { user: true }
            },
            job: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({ success: true, interviews });
  } catch (error) {
    console.error('Fetch Interviews Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, date, mode, link, location, interviewer, round } = await req.json();

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true, student: true }
    });

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    const newInterview = await prisma.interview.create({
      data: {
        applicationId,
        date: new Date(date),
        mode,
        link,
        location,
        interviewer,
        round: parseInt(round) || 1
      }
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: application.student.userId,
        title: `Interview Scheduled: ${application.job.title}`,
        message: `Your round ${round || 1} interview has been scheduled for ${new Date(date).toLocaleString()}.`
      }
    });

    // Audit Timeline
    await prisma.applicationTimeline.create({
      data: {
        applicationId,
        status: application.status,
        note: `Interview Scheduled for ${new Date(date).toLocaleString()}`
      }
    });

    return NextResponse.json({ success: true, interview: newInterview });
  } catch (error) {
    console.error('Create Interview Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { interviewId, date, link, location, mode } = await req.json();

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { application: { include: { student: true, job: true } } }
    });

    if (!interview) {
      return NextResponse.json({ success: false, message: 'Interview not found' }, { status: 404 });
    }

    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        date: new Date(date),
        link: link || interview.link,
        location: location || interview.location,
        mode: mode || interview.mode,
        status: 'RESCHEDULED'
      }
    });

    await prisma.notification.create({
      data: {
        userId: interview.application.student.userId,
        title: `Interview Rescheduled: ${interview.application.job.title}`,
        message: `Your interview has been rescheduled to ${new Date(date).toLocaleString()}.`
      }
    });

    await prisma.applicationTimeline.create({
      data: {
        applicationId: interview.applicationId,
        status: interview.application.status,
        note: `Interview Rescheduled to ${new Date(date).toLocaleString()}`
      }
    });

    return NextResponse.json({ success: true, interview: updated });
  } catch (error) {
    console.error('Update Interview Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: { application: { include: { student: true, job: true } } }
    });

    if (!interview) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    await prisma.interview.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    await prisma.notification.create({
      data: {
        userId: interview.application.student.userId,
        title: `Interview Cancelled: ${interview.application.job.title}`,
        message: `Your scheduled interview has been cancelled.`
      }
    });

    await prisma.applicationTimeline.create({
      data: {
        applicationId: interview.applicationId,
        status: interview.application.status,
        note: `Interview Cancelled`
      }
    });

    return NextResponse.json({ success: true, message: 'Cancelled successfully' });
  } catch (error) {
    console.error('Delete Interview Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
