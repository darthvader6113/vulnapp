import { FiSearch } from "react-icons/fi";

interface CourseFilterBarProps {
  search: string;
  category: string;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function CourseFilterBar({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onSearchSubmit,
}: CourseFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5 font-mono">
      <form onSubmit={onSearchSubmit} className="flex-1 relative">
        <FiSearch className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses by keyword..."
          className="w-full pl-9 pr-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
        />
      </form>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
      >
        <option value="all">All Categories</option>
        <option value="Security">Security</option>
        <option value="Development">Development</option>
        <option value="DevOps">DevOps</option>
        <option value="General">General</option>
      </select>
    </div>
  );
}

