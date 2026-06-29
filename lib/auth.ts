import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "campusforge_secret_key_2026";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getServerSession(req: Request): JwtPayload | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc: any, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies["token"];
  if (!token) return null;

  return verifyToken(token);
}