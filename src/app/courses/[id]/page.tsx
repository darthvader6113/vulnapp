"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseModulesAccordion } from "@/components/courses/CourseModulesAccordion";
import { CourseAttachmentsList, Attachment } from "@/components/courses/CourseAttachmentsList";

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructorId: string;
  instructorName: string;
  isPublished: boolean;
  modules: Array<{ title: string; content: string; duration: string }>;
  attachments: Attachment[];
  createdAt: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/courses/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course not found");
        return res.json();
      })
      .then((data) => setCourse(data.course))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? In this lab, any user can trigger this deletion (demonstrating BOLA/IDOR).")) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/courses/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setDeleteSuccess(true);
      setTimeout(() => router.push("/courses"), 1500);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-mono text-xs animate-pulse">Loading course data...</div>;
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-slate-900 border border-slate-800 p-6 rounded font-mono">
        <h2 className="text-lg font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-xs text-slate-400 mb-5">{error || "The requested course does not exist."}</p>
        <Link
          href="/courses"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-sky-600 text-white text-xs font-semibold"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Courses</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-mono">
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Catalog</span>
        </Link>
      </div>

      {deleteSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded text-xs flex items-center space-x-2">
          <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Course successfully deleted via BOLA demonstration. Redirecting...</span>
        </div>
      )}

      {/* Header Chunk */}
      <CourseHeader
        course={course}
        user={user}
        deleting={deleting}
        onDelete={handleDelete}
      />

      {/* Modules Accordion Chunk */}
      <CourseModulesAccordion modules={course.modules} />

      {/* Attachments List Chunk */}
      <CourseAttachmentsList attachments={course.attachments} />
    </div>
  );
}
