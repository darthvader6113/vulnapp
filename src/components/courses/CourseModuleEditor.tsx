import { FiPlusCircle, FiTrash2 } from "react-icons/fi";

export interface ModuleInput {
  title: string;
  content: string;
  duration: string;
}

interface CourseModuleEditorProps {
  modules: ModuleInput[];
  onAddModule: () => void;
  onRemoveModule: (index: number) => void;
  onModuleChange: (index: number, field: keyof ModuleInput, value: string) => void;
}

export function CourseModuleEditor({
  modules,
  onAddModule,
  onRemoveModule,
  onModuleChange,
}: CourseModuleEditorProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Course Modules & Lessons</h2>
        <button
          type="button"
          onClick={onAddModule}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
        >
          <FiPlusCircle className="w-3.5 h-3.5" />
          <span>Add Module</span>
        </button>
      </div>

      <div className="space-y-3">
        {modules.map((mod, index) => (
          <div key={index} className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide">
                Module {index + 1}
              </span>
              {modules.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveModule(index)}
                  className="text-slate-500 hover:text-rose-400 text-xs flex items-center space-x-1"
                >
                  <FiTrash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={mod.title}
                  onChange={(e) => onModuleChange(index, "title", e.target.value)}
                  placeholder="Module title (e.g. JWT Token Validation)"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={mod.duration}
                  onChange={(e) => onModuleChange(index, "duration", e.target.value)}
                  placeholder="Duration (e.g. 25 min)"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <textarea
              rows={2}
              value={mod.content}
              onChange={(e) => onModuleChange(index, "content", e.target.value)}
              placeholder="Module notes, instructions or curriculum outline..."
              className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

