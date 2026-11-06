import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "super_insecure_jwt_secret_change_me_12345";

export interface TokenPayload {
  id: string;
  email: string;
  role: "student" | "instructor" | "admin";
  name: string;
}

export function signToken(payload: TokenPayload): string {
  // Uses HS256 JWT
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  // 1. Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    return verifyToken(token);
  }

  // 2. Try cookies
  const cookieToken = request.cookies.get("token")?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

