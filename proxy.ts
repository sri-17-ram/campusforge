import { NextRequest, NextResponse } from "next/server";
export default function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Public Routes
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/api/auth/login",
    "/api/auth/register",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // No token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Decode JWT in Edge Runtime (signature verified in API routes)
  let user = null;
  try {
    const payload = token.split(".")[1];
    user = JSON.parse(atob(payload));
  } catch (e) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!user || !user.role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role Protection

  if (
    pathname.startsWith("/dashboard") &&
    user.role !== "STUDENT"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    pathname.startsWith("/faculty") &&
    user.role !== "FACULTY"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    pathname.startsWith("/recruiter") &&
    user.role !== "RECRUITER"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/faculty/:path*",
    "/recruiter/:path*",
  ],
};