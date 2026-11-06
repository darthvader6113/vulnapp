import Link from "next/link";
import { FiClock, FiPaperclip } from "react-icons/fi";

export interface CourseItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructorName: string;
  isPublished: boolean;
  modules: any[];
  attachments: any[];
  createdAt: string;
}

interface CourseCardProps {
  course: CourseItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 rounded p-5 transition group font-mono">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {course.category}
          </span>
          <span className="text-[10px] text-slate-500">
            By {course.instructorName}
          </span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition line-clamp-2">
          <Link href={`/courses/${course._id}`}>{course.title}</Link>
        </h3>

        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <FiClock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">{course.modules?.length || 0} modules</span>
          </span>
          {course.attachments?.length > 0 && (
            <span className="flex items-center space-x-1 text-sky-400">
              <FiPaperclip className="w-3.5 h-3.5" />
              <span className="text-[11px]">{course.attachments.length} files</span>
            </span>
          )}
        </div>

        <Link
          href={`/courses/${course._id}`}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

