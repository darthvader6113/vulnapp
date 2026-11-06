import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    /* 
      ================================================================================
      [EDUCATIONAL VULNERABILITY #1: MASS ASSIGNMENT / PRIVILEGE ESCALATION]
      CWE-915 / OWASP A01: Broken Access Control
      
      Problem:
      The code merges `body` into the new user creation without filtering allowed fields.
      An attacker can send `role: "admin"` in their JSON payload to register as an administrator!
      
      Remediation:
      Explicitly destructure only allowed registration fields:
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student", // default role enforced server-side
      });
      ================================================================================
    */
    const userRole = body.role || "student"; // vulnerable to role spoofing via body payload

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      bio: body.bio || "",
    });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 201 }
    );

    // Set cookie for browser sessions
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register" },
      { status: 500 }
    );
  }
}

