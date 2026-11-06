"use client";

import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { VulnerabilitySidebar, VulnerabilityItem } from "@/components/security/VulnerabilitySidebar";
import { VulnerabilityDetailCard } from "@/components/security/VulnerabilityDetailCard";

const VULNERABILITIES: VulnerabilityItem[] = [
  {
    id: "bola",
    title: "Broken Object Level Authorization (BOLA / IDOR)",
    cwe: "CWE-639",
    owasp: "A01:2021 - Broken Access Control",
    severity: "High",
    location: "src/app/api/courses/[id]/route.ts",
    vulnerableCode: `// Checks authentication, but forgets to check resource ownership!
const user = getUserFromRequest(request);
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Any authenticated user can overwrite or delete another instructor's course:
await Course.findByIdAndDelete(params.id);`,
    fixedCode: `const user = getUserFromRequest(request);
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const course = await Course.findById(params.id);
// Enforce tenancy & ownership:
if (course.instructorId.toString() !== user.id && user.role !== "admin") {
  return NextResponse.json({ error: "Forbidden: You do not own this course" }, { status: 403 });
}
await Course.findByIdAndDelete(params.id);`,
    explanation:
      "BOLA occurs when an application provides direct access to objects based on user-supplied input without verifying that the authenticated user has permissions for that specific target object.",
    remediation:
      "Always cross-reference the requesting user's verified session identity with the object's owner record or tenancy identifier before mutating or accessing private data.",
  },
  {
    id: "mass-assignment",
    title: "Mass Assignment / Privilege Escalation",
    cwe: "CWE-915",
    owasp: "A01:2021 - Broken Access Control",
    severity: "High",
    location: "src/app/api/auth/register/route.ts",
    vulnerableCode: `const body = await request.json();
// Unfiltered body payload merges user-supplied 'role' into the created user
const user = await User.create({
  name: body.name,
  email: body.email,
  password: hashedPassword,
  role: body.role || "student", // Attacker sends role: "admin"
});`,
    fixedCode: `const { name, email, password } = await request.json();

// Strict server-side role assignment:
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "student", // Hardcoded default, cannot be overridden by client input
});`,
    explanation:
      "When software automatically binds request parameters to internal model properties without filtering, attackers can inject unauthorized attributes such as administrative roles, balance adjustments, or verification flags.",
    remediation:
      "Enforce explicit parameter whitelisting (Data Transfer Objects / schema validation using Zod or Yup) and never bind sensitive metadata from untrusted request bodies.",
  },
  {
    id: "file-upload",
    title: "Insecure File Upload & Static Directory Exposure",
    cwe: "CWE-434",
    owasp: "A04:2021 - Insecure Design",
    severity: "High",
    location: "src/app/api/upload/route.ts",
    vulnerableCode: `// Blindly uses client-provided name and stores directly in public web root
const filePath = path.join(uploadDir, file.name);
await writeFile(filePath, buffer);
// User files are now directly accessible via /uploads/filename!`,
    fixedCode: `// 1. Validate file extension and magic bytes whitelist:
const ALLOWED_EXT = ['.pdf', '.png', '.jpg'];
const ext = path.extname(file.name).toLowerCase();
if (!ALLOWED_EXT.includes(ext)) {
  throw new Error("Disallowed file type");
}

// 2. Generate random unguessable storage key:
const safeName = \`\${crypto.randomUUID()}\${ext}\`;
// 3. Store outside public/ or serve with Content-Disposition: attachment`,
    explanation:
      "Allowing unrestricted file uploads can lead to arbitrary active content execution (e.g. uploading HTML/SVG files with malicious scripts executing in the application's origin context) or disk exhaustion.",
    remediation:
      "Whitelist allowed file extensions and MIME signatures, store uploaded files outside the public web root or in object storage (S3/GCS), and deliver with strict Content-Security-Policy headers.",
  },
  {
    id: "nosql-injection",
    title: "NoSQL Query Injection via Unsanitized Filter Objects",
    cwe: "CWE-943",
    owasp: "A03:2021 - Injection",
    severity: "Medium",
    location: "src/app/api/courses/route.ts",
    vulnerableCode: `const filterRaw = searchParams.get("filter");
if (filterRaw) {
  const parsedFilter = JSON.parse(filterRaw);
  // Directly spread untrusted object into MongoDB query!
  query = { ...query, ...parsedFilter };
}
const courses = await Course.find(query);`,
    fixedCode: `// Whitelist safe scalar filter keys and sanitize values:
if (category && ALLOWED_CATEGORIES.includes(category)) {
  query.category = String(category);
}
if (search) {
  // Escape regex special characters:
  const escaped = search.replace(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g, '\\\\$&');
  query.title = { $regex: escaped, $options: "i" };
}`,
    explanation:
      "In MongoDB/Mongoose, passing raw JSON objects from query parameters into query functions allows attackers to use operators like $ne, $regex, or $where to bypass filters or extract hidden records.",
    remediation:
      "Never pass untrusted objects or query operators ($) into MongoDB queries. Use explicit schema validation and sanitize search strings.",
  },
  {
    id: "rbac-missing",
    title: "Missing Function Level Access Control (RBAC)",
    cwe: "CWE-285",
    owasp: "A01:2021 - Broken Access Control",
    severity: "Medium",
    location: "src/app/api/courses/route.ts",
    vulnerableCode: `// Allows any logged-in user to author courses regardless of role
const user = getUserFromRequest(request);
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Missing check: user.role is not verified!
const newCourse = await Course.create({ ... });`,
    fixedCode: `const user = getUserFromRequest(request);
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Verify role requirement:
if (user.role !== "instructor" && user.role !== "admin") {
  return NextResponse.json({ error: "Forbidden: Instructor role required" }, { status: 403 });
}`,
    explanation:
      "When sensitive administrative or instructor actions only check if a user is authenticated rather than verifying their assigned role, unauthorized standard users can perform privileged actions.",
    remediation:
      "Implement centralized role-based access control (RBAC) middleware or guard clauses on all non-public mutation endpoints.",
  },
];

export default function SecurityLabPage() {
  const [selectedId, setSelectedId] = useState(VULNERABILITIES[0].id);
  const activeVuln = VULNERABILITIES.find((v) => v.id === selectedId) || VULNERABILITIES[0];

  return (
    <div className="space-y-6 pb-16 font-mono">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold mb-2">
          <FiAlertTriangle className="w-3.5 h-3.5" />
          <span>Defensive Auditing & Code Review Reference</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Vulnerability Matrix & Security Lab
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Detailed analysis of the intentional OWASP flaws present in this Learning Management System.
          Use this guide for static application security testing (SAST), code review workshops, and defensive remediation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Chunk */}
        <div className="lg:col-span-4">
          <VulnerabilitySidebar
            vulnerabilities={VULNERABILITIES}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Detail Card Chunk */}
        <div className="lg:col-span-8">
          <VulnerabilityDetailCard vulnerability={activeVuln} />
        </div>
      </div>
    </div>
  );
}
