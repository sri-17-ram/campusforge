import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "FACULTY") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const department = searchParams.get("department") || "";
    const year = searchParams.get("year");
    const placementReady = searchParams.get("placementReady");
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { skills: { some: { name: { contains: search, mode: "insensitive" } } } }
      ];
    }
    
    if (department) {
      whereClause.branch = department;
    }
    
    if (year) {
      whereClause.year = parseInt(year);
    }
    
    if (placementReady !== null && placementReady !== "") {
      whereClause.isPlacementReady = placementReady === "true";
    }

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
        include: {
          user: { select: { name: true, email: true, avatar: true } },
          skills: true,
          projects: true,
          certificates: true,
          applications: true
        },
        skip,
        take: limit,
        orderBy: { user: { name: 'asc' } }
      }),
      prisma.student.count({ where: whereClause })
    ]);

    return NextResponse.json({
      success: true,
      students,
      totalPages: Math.ceil(totalCount / limit),
      totalCount
    });

  } catch (error) {
    console.error("Students API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
