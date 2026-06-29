import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const company = await prisma.recruiter.findUnique({
      where: { id },
      include: {
        jobs: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { applications: true }
            }
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
    }

    // Calculate hiring statistics
    const totalJobs = await prisma.job.count({ where: { recruiterId: id } });
    const totalApplications = await prisma.jobApplication.count({
      where: { job: { recruiterId: id } }
    });
    const hiredCount = await prisma.jobApplication.count({
      where: { job: { recruiterId: id }, status: 'HIRED' }
    });

    return NextResponse.json({
      success: true,
      company,
      stats: {
        totalJobs,
        totalApplications,
        hiredCount
      }
    });
  } catch (error) {
    console.error('Fetch Company Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
