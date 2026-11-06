"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@ark-ui/react";
import { useAuth } from "@/context/AuthContext";
import { FiAlertCircle } from "react-icons/fi";
import { CourseFileUploader } from "@/components/courses/CourseFileUploader";
import { CourseModuleEditor, ModuleInput } from "@/components/courses/CourseModuleEditor";
import { Attachment } from "@/components/courses/CourseAttachmentsList";

export default function NewCoursePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Security");
  const [modules, setModules] = useState<ModuleInput[]>([
    { title: "Introduction & Setup", content: "Course overview and prerequisites.", duration: "15 min" },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (authLoading) {
    return <div className="text-center py-20 text-slate-500 font-mono">Checking authorization...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-slate-900 border border-slate-800 p-6 rounded font-mono">
        <FiAlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2.5" />
        <h2 className="text-lg font-bold text-white">Authentication Required</h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          You must be logged in to create and publish a course.
        </p>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleAddModule = () => {
    setModules([...modules, { title: "", content: "", duration: "20 min" }]);
  };

  const handleRemoveModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleModuleChange = (index: number, field: keyof ModuleInput, value: string) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "File upload failed");
        }

        setAttachments((prev) => [...prev, data.file]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          modules,
          attachments,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      router.push(`/courses/${data.course._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Create New Course</h1>
        <p className="text-xs text-slate-400 mt-1">
          Publish curriculum modules, attach slides/materials, and share with learners
        </p>
      </div>

      {error && (
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Course Info */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Course Overview</h2>

          <Field.Root className="space-y-1">
            <Field.Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Course Title
            </Field.Label>
            <Field.Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Web App Security & Penetration Testing"
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500"
            />
          </Field.Root>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field.Root className="space-y-1">
              <Field.Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                Category
              </Field.Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="Security">Security</option>
                <option value="Development">Development</option>
                <option value="DevOps">DevOps</option>
                <option value="General">General</option>
              </select>
            </Field.Root>
          </div>

          <Field.Root className="space-y-1">
            <Field.Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Description / Syllabus Overview
            </Field.Label>
            <Field.Textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what students will master..."
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500"
            />
          </Field.Root>
        </div>

        {/* Ark UI File Uploader Chunk */}
        <CourseFileUploader
          attachments={attachments}
          uploading={uploading}
          onFileUpload={handleFileUpload}
          onRemoveAttachment={handleRemoveAttachment}
        />

        {/* Modules Editor Chunk */}
        <CourseModuleEditor
          modules={modules}
          onAddModule={handleAddModule}
          onRemoveModule={handleRemoveModule}
          onModuleChange={handleModuleChange}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition disabled:opacity-50"
          >
            {submitting ? "Publishing Course..." : "Publish Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
