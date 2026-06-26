import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "campusforge_secret_key_2026";

export function generateToken(user: {
  id: string;
  email: string;
  role: string;
}) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}