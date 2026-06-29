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
      where: { userId: decoded.id },
      include: { user: { select: { name: true, email: true, avatar: true } } }
    });

    if (!recruiter) {
      return NextResponse.json({ success: false, message: 'Recruiter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, recruiter });
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Separate User fields from Recruiter fields
    const { name, avatar, ...recruiterFields } = body;

    if (name || avatar) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { name, avatar }
      });
    }

    const updated = await prisma.recruiter.update({
      where: { userId: decoded.id },
      data: recruiterFields,
      include: { user: { select: { name: true, email: true, avatar: true } } }
    });

    return NextResponse.json({ success: true, recruiter: updated });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
