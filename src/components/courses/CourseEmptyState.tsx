import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

interface CourseEmptyStateProps {
  user: any;
  seeding: boolean;
  onSeed: () => void;
}

export function CourseEmptyState({ user, seeding, onSeed }: CourseEmptyStateProps) {
  return (
    <div className="text-center py-16 bg-slate-900/40 rounded border border-dashed border-slate-800 font-mono">
      <FiBookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-white">No courses found</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
        There are currently no courses matching your query. Create one or seed demo courses!
      </p>
      {user ? (
        <button
          onClick={onSeed}
          disabled={seeding}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
        >
          <LuSparkles className="w-3.5 h-3.5" />
          <span>{seeding ? "Generating..." : "Generate 3 Demo Courses"}</span>
        </button>
      ) : (
        <Link
          href="/auth/login"
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
        >
          <span>Sign In to Create Courses</span>
        </Link>
      )}
    </div>
  );
}

