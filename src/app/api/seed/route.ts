import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Create Default Users if not existing
    const defaultPassword = await bcrypt.hash("password123", 10);

    const usersToSeed = [
      {
        name: "Alice Student",
        email: "student@vulnlms.local",
        password: defaultPassword,
        role: "student",
        bio: "Security enthusiast and student learner.",
      },
      {
        name: "Prof. Alan Turing",
        email: "instructor@vulnlms.local",
        password: defaultPassword,
        role: "instructor",
        bio: "Senior Cybersecurity Instructor and Course Author.",
      },
      {
        name: "System Admin",
        email: "admin@vulnlms.local",
        password: defaultPassword,
        role: "admin",
        bio: "Platform Administrator.",
      },
    ];

    for (const u of usersToSeed) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }

    const instructor = await User.findOne({ email: "instructor@vulnlms.local" });
    const instructorId = instructor ? instructor._id.toString() : "60d0fe4f5311236168a109ca";

    // 2. Create Default Courses if courses collection is empty
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const sampleCourses = [
        {
          title: "OWASP Top 10 Web Application Security Masterclass",
          description: "A comprehensive deep dive into web vulnerabilities: Broken Access Control (BOLA), SQL/NoSQL Injection, Insecure Deserialization, and File Upload flaws with practical defense strategies.",
          category: "Security",
          instructorId: instructorId,
          instructorName: "Prof. Alan Turing",
          isPublished: true,
          modules: [
            {
              title: "Module 1: Broken Object Level Authorization (BOLA)",
              content: "Understanding object reference validation, tenancy checks, and preventing cross-user data tampering.",
              duration: "30 min",
            },
            {
              title: "Module 2: Query & Object Injection (NoSQL)",
              content: "Examining operator injection ($ne, $regex, $where) in modern document databases and schema sanitization.",
              duration: "45 min",
            },
            {
              title: "Module 3: Insecure File Upload & Content Verification",
              content: "Magic byte inspection, extension whitelisting, and isolating user uploads from executable execution domains.",
              duration: "40 min",
            },
          ],
          attachments: [
            {
              name: "OWASP_Top_10_Quick_Audit_Guide.pdf",
              url: "/uploads/sample_cheatsheet.pdf",
              fileType: "application/pdf",
              size: 204800,
            },
          ],
        },
        {
          title: "Full-Stack TypeScript & Next.js Architecture",
          description: "Learn how to build secure, modular full-stack web applications with Next.js App Router, React Server Components, and Ark UI headless components.",
          category: "Development",
          instructorId: instructorId,
          instructorName: "Prof. Alan Turing",
          isPublished: true,
          modules: [
            {
              title: "Module 1: Next.js 14 App Router & Standalone Deployments",
              content: "Architecting route handlers, client components, and minimal standalone Docker containerization.",
              duration: "35 min",
            },
            {
              title: "Module 2: Headless UI with Ark UI Primitives",
              content: "Composing accessible accordions, file upload dropzones, tabs, and modals using Ark UI.",
              duration: "30 min",
            },
          ],
          attachments: [],
        },
        {
          title: "Docker Hardening & Cloud Infrastructure Security",
          description: "Container hardening, Docker multi-stage builds, rootless execution, network policies, and vulnerability scanning for production deployments.",
          category: "DevOps",
          instructorId: instructorId,
          instructorName: "Prof. Alan Turing",
          isPublished: true,
          modules: [
            {
              title: "Module 1: Building Secure Docker Images",
              content: "Stripping unnecessary package managers, running as non-root users, and optimizing layer caching.",
              duration: "25 min",
            },
          ],
          attachments: [],
        },
      ];

      await Course.insertMany(sampleCourses);
    }

    return NextResponse.json({
      message: "Database seeded successfully with default accounts and courses.",
      demoAccounts: [
        { email: "student@vulnlms.local", password: "password123", role: "student" },
        { email: "instructor@vulnlms.local", password: "password123", role: "instructor" },
        { email: "admin@vulnlms.local", password: "password123", role: "admin" },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

