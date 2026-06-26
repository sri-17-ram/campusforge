import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "campusforge_secret_key_2026";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}