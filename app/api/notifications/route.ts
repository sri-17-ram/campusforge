import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalCount = await prisma.notification.count({
      where: { userId: decoded.id }
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: decoded.id, read: false }
    });

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
       await prisma.notification.update({
         where: { id },
         data: { read: true }
       });
    } else {
       await prisma.notification.updateMany({
         where: { userId: decoded.id, read: false },
         data: { read: true }
       });
    }

    return NextResponse.json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update notifications" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
       await prisma.notification.deleteMany({
         where: { id, userId: decoded.id }
       });
    } else {
       // Bulk delete all notifications for the user
       await prisma.notification.deleteMany({
         where: { userId: decoded.id }
       });
    }

    return NextResponse.json({ success: true, message: "Notifications deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete notifications" }, { status: 500 });
  }
}
