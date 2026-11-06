import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";

interface CourseHeaderProps {
  course: {
    _id: string;
    title: string;
    description: string;
    category: string;
    instructorId: string;
    instructorName: string;
    modules?: any[];
    attachments?: any[];
  };
  user: any;
  deleting: boolean;
  onDelete: () => void;
}

export function CourseHeader({ course, user, deleting, onDelete }: CourseHeaderProps) {
  const isOwner = user && user.id === course.instructorId;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-6 space-y-4 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
          {course.category}
        </span>
        <div className="flex items-center space-x-2">
          {user && (
            <button
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium transition"
              title="BOLA Vulnerability Demo: any authenticated user can delete"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>{deleting ? "Deleting..." : "Delete Course (BOLA Demo)"}</span>
            </button>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white tracking-tight">
        {course.title}
      </h1>

      <div className="flex items-center space-x-3 text-xs text-slate-400">
        <span>Instructor: <strong className="text-slate-200">{course.instructorName}</strong></span>
        <span>•</span>
        <span>{course.modules?.length || 0} Modules</span>
        <span>•</span>
        <span>{course.attachments?.length || 0} Attached Materials</span>
      </div>

      <div className="pt-3 border-t border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-line">
        {course.description}
      </div>

      {/* Security Lab Callout for BOLA */}
      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded text-[11px] space-y-1">
        <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
          <FiAlertTriangle className="w-3.5 h-3.5" />
          <span>Auditing Note: CWE-639 BOLA / IDOR Point</span>
        </div>
        <p className="text-slate-300">
          Current user ID: <code className="text-amber-400">{user ? user.id : "Not logged in"}</code>.
          Course instructor ID: <code className="text-amber-400">{course.instructorId}</code>.
          {user && !isOwner && (
            <span className="text-rose-400 ml-1">
              You are NOT the owner, yet the backend route <code className="text-slate-200">DELETE /api/courses/{course._id}</code> allows deleting this course without checking instructorId.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

