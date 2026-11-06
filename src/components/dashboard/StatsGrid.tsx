import { FiBookOpen, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

interface StatsGridProps {
  coursesCount: number | null;
}

export function StatsGrid({ coursesCount }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center space-x-3">
        <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded">
          <FiBookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">
            {coursesCount !== null ? coursesCount : "..."}
          </div>
          <div className="text-[11px] text-slate-400">Published Courses</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center space-x-3">
        <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded">
          <FiAlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">6 Modules</div>
          <div className="text-[11px] text-slate-400">Auditable Vulnerability Labs</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded">
          <FiCheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">Docker Ready</div>
          <div className="text-[11px] text-slate-400">MongoDB + Next.js Containerized</div>
        </div>
      </div>
    </section>
  );
}

