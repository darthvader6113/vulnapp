import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Course from "@/models/Course";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const filterRaw = searchParams.get("filter");

    let query: any = {};

    /*
      ================================================================================
      [EDUCATIONAL VULNERABILITY #2: NOSQL QUERY INJECTION / UNSANITIZED OBJECT QUERY]
      CWE-943 / OWASP A03: Injection
      
      Problem:
      If raw user input or parsed JSON is passed directly into Mongoose `find()`:
      If the client sends `?filter={"$where":"sleep(1000)"}` or `?filter={"$ne":null}`,
      it alters query logic or accesses unreleased drafts.
      
      Remediation:
      Always sanitize inputs, use strictly validated strings, or use $eq / regex escaped strings:
      query.title = { $regex: escapeRegExp(search), $options: "i" };
      ================================================================================
    */
    if (filterRaw) {
      try {
        const parsedFilter = JSON.parse(filterRaw);
        // Vulnerable: Direct query assignment without schema whitelist validation
        query = { ...query, ...parsedFilter };
      } catch {
        // invalid JSON
      }
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Fetch courses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /*
      ================================================================================
      [EDUCATIONAL VULNERABILITY #3: MISSING FUNCTION LEVEL ACCESS CONTROL]
      CWE-285 / OWASP A01: Broken Access Control
      
      Problem:
      Any authenticated user (even with role: "student") can publish courses because
      the endpoint does not check if user.role === 'instructor' || user.role === 'admin'.
      
      Remediation:
      if (user.role !== 'instructor' && user.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Instructor role required" }, { status: 403 });
      }
      ================================================================================
    */

    await connectToDatabase();
    const body = await request.json();

    const { title, description, category, modules, attachments, isPublished } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const newCourse = await Course.create({
      title,
      description,
      category: category || "General",
      instructorId: user.id,
      instructorName: user.name,
      isPublished: isPublished !== undefined ? isPublished : true,
      modules: modules || [],
      attachments: attachments || [],
    });

    return NextResponse.json(
      { message: "Course created successfully", course: newCourse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}

