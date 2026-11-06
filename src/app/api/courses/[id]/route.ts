import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Course from "@/models/Course";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    /*
      ================================================================================
      [EDUCATIONAL VULNERABILITY #4: BROKEN OBJECT LEVEL AUTHORIZATION (BOLA / IDOR)]
      CWE-639 / OWASP A01: Broken Access Control
      
      Problem:
      The API verifies that the user is logged in, but fails to check whether
      the user is actually the creator/instructor of this specific course!
      Any student or rival instructor can edit, overwrite, or deface anyone's course.
      
      Remediation:
      if (course.instructorId.toString() !== user.id && user.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: You do not own this course" },
          { status: 403 }
        );
      }
      ================================================================================
    */

    const body = await request.json();
    const updatedCourse = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    /*
      ================================================================================
      [EDUCATIONAL VULNERABILITY #4 continued: BOLA / IDOR DELETION]
      CWE-639 / OWASP A01: Broken Access Control
      
      Problem:
      Missing ownership verification allows any authenticated account to delete any course.
      ================================================================================
    */

    await Course.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete course" },
      { status: 500 }
    );
  }
}

