import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: decoded.id }
    });

    if (!recruiter) {
      return NextResponse.json({ success: false, message: 'Recruiter profile not found' }, { status: 404 });
    }

    // Fetch all jobs for this recruiter
    let jobs = await prisma.job.findMany({
      where: { recruiterId: recruiter.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Auto-expire jobs if deadline has passed
    const now = new Date();
    let updated = false;
    jobs = await Promise.all(jobs.map(async (job) => {
      if (job.deadline && new Date(job.deadline) < now && job.status !== 'EXPIRED' && job.status !== 'CLOSED') {
        updated = true;
        return await prisma.job.update({
          where: { id: job.id },
          data: { status: 'EXPIRED' },
          include: {
            _count: { select: { applications: true } }
          }
        });
      }
      return job;
    }));

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Fetch Jobs Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: decoded.id }
    });

    if (!recruiter) {
      return NextResponse.json({ success: false, message: 'Recruiter profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { 
      title, description, location, salary, 
      employmentType, experience, department, 
      skillsRequired, openings, deadline, status 
    } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'Title and description are required' }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary,
        employmentType,
        experience,
        department,
        skillsRequired,
        openings: openings ? parseInt(openings) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'PUBLISHED',
        recruiterId: recruiter.id
      }
    });

    await prisma.activity.create({
      data: {
        userId: decoded.id,
        action: 'Job Posted',
        details: title
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Create Job Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
