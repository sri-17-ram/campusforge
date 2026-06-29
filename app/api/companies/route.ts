import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recruiters = await prisma.recruiter.findMany({
      where: { company: { not: null } },
      select: {
        id: true,
        company: true,
        companyLogo: true,
        industry: true,
        location: true,
        companySize: true,
        _count: {
          select: { jobs: { where: { status: 'PUBLISHED' } } }
        }
      },
      orderBy: { company: 'asc' }
    });

    return NextResponse.json({ success: true, companies: recruiters });
  } catch (error) {
    console.error('Fetch Companies Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
