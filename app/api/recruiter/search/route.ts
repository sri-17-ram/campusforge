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
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json({ success: true, students: [] });
    }

    // Global Search: Students matching name, branch, skills
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { branch: { contains: query, mode: 'insensitive' } },
          { skills: { some: { name: { contains: query, mode: 'insensitive' } } } },
        ]
      },
      include: {
        user: { select: { name: true, avatar: true } },
        skills: true,
        projects: { where: { status: 'APPROVED' } },
        certificates: { where: { status: 'APPROVED' } }
      },
      take: 50 // Limit to 50 for performance
    });

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
