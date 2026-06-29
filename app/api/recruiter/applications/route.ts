import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, status, note } = await req.json();
    if (!applicationId || !status) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        student: { include: { user: true } }
      }
    });

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    // Update application
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    // Create timeline entry
    await prisma.applicationTimeline.create({
      data: {
        applicationId,
        status,
        note: note || `Status changed to ${status}`
      }
    });

    // Notification to student
    let notifTitle = `Application Update: ${application.job.title}`;
    let notifMsg = `Your application status is now ${status}.`;
    
    if (status === 'TECHNICAL_ROUND') notifMsg = `Great news! You have been moved to the Technical Round for ${application.job.title}.`;
    else if (status === 'HR_ROUND') notifMsg = `You have advanced to the HR Round for ${application.job.title}.`;
    else if (status === 'OFFER') notifMsg = `Congratulations! You have received an offer for ${application.job.title}.`;
    else if (status === 'ACCEPTED') notifMsg = `You have successfully accepted the offer for ${application.job.title}.`;
    else if (status === 'HIRED') notifMsg = `Welcome aboard! You are officially hired for ${application.job.title}.`;
    else if (status === 'REJECTED') notifMsg = `We regret to inform you that your application for ${application.job.title} was not moved forward.`;
    else if (status === 'SCREENING') notifMsg = `Your application for ${application.job.title} is now under active screening.`;

    await prisma.notification.create({
      data: {
        userId: application.student.userId,
        title: notifTitle,
        message: notifMsg
      }
    });

    // Recruiter Activity
    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: `Moved candidate to ${status}`,
        details: `${application.student.user.name} - ${application.job.title}`
      }
    });

    return NextResponse.json({ success: true, message: 'Application updated successfully' });
  } catch (error) {
    console.error('Update Application Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
