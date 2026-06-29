import { prisma } from "@/lib/prisma";
import { verifyToken, getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const jobs = await prisma.job.findMany({
      include: { recruiter: { include: { user: true } } }
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "RECRUITER") return NextResponse.json({ success: false }, { status: 401 });

    const { title, description, location, salary } = await req.json();
    if (!title || !description) return NextResponse.json({ success: false, message: "Title and description required" }, { status: 400 });

    const recruiter = await prisma.recruiter.findUnique({ where: { userId: decoded.id } });
    if (!recruiter) return NextResponse.json({ success: false }, { status: 404 });

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary,
        recruiterId: recruiter.id
      }
    });

    return NextResponse.json({ success: true, message: "Job created", data: job });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create job" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "RECRUITER") return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: "No ID" }, { status: 400 });

    const recruiter = await prisma.recruiter.findUnique({ where: { userId: decoded.id } });
    if (!recruiter) return NextResponse.json({ success: false }, { status: 404 });

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.recruiterId !== recruiter.id) return NextResponse.json({ success: false }, { status: 403 });

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Deletion Failed" }, { status: 500 });
  }
}
