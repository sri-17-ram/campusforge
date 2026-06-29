import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, context: any) {
  const { id } = await context.params;
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id: id },
      include: {
        applications: {
          include: {
            student: {
              include: { 
                user: {
                  include: {
                    activities: { orderBy: { createdAt: 'desc' }, take: 5 }
                  }
                },
                projects: true, 
                skills: true, 
                certificates: true 
              }
            },
            timeline: { orderBy: { createdAt: 'desc' } },
            interviews: true
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    // Auto-expire
    if (job.deadline && new Date(job.deadline) < new Date() && job.status !== 'EXPIRED' && job.status !== 'CLOSED') {
      await prisma.job.update({ where: { id: job.id }, data: { status: 'EXPIRED' } });
      job.status = 'EXPIRED';
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Fetch Job Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  const { id } = await context.params;
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const existing = await prisma.job.findUnique({ where: { id: id }});
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    const updatedJob = await prisma.job.update({
      where: { id: id },
      data: {
        ...body,
        openings: body.openings ? parseInt(body.openings) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
      }
    });

    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: 'Job Edited',
        details: updatedJob.title
      }
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Update Job Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { id } = await context.params;
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.job.findUnique({ where: { id: id }});
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: id }
    });

    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: 'Job Deleted',
        details: existing.title
      }
    });

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
