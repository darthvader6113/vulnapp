import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /*
      ================================================================================
      [EDUCATIONAL VULNERABILITY #5: INSECURE FILE UPLOAD / WEAK EXTENSION CHECK]
      CWE-434 / OWASP A04: Insecure Design
      
      Problem:
      1. Directly uses file.name which allows path manipulation or uploading active content (.html, .svg with script tags).
      2. Files are stored directly in public/ folder where browsers can execute HTML/SVG directly in the application's domain!
      
      Remediation:
      1. Validate file signature / magic bytes, not just MIME types.
      2. Whitelist safe extensions: const ALLOWED = ['.pdf', '.png', '.jpg'];
      3. Generate random unguessable file names: const safeName = `${crypto.randomUUID()}${path.extname(file.name)}`;
      4. Serve files with Content-Disposition: attachment and strict CSP.
      ================================================================================
    */

    // Sanitize basic path traversal for safety in the lab container while demonstrating the concept
    const originalName = file.name || "uploaded_file";
    const baseName = path.basename(originalName); // stops directory traversal outside uploads
    const uniquePrefix = Date.now();
    const finalFileName = `${uniquePrefix}_${baseName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, finalFileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      file: {
        name: originalName,
        url: fileUrl,
        size: file.size,
        fileType: file.type || "application/octet-stream",
        uploadedAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

