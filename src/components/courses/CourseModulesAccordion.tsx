"use client";

import { Accordion } from "@ark-ui/react";
import { FiBookOpen, FiClock, FiChevronDown } from "react-icons/fi";

interface Module {
  title: string;
  content: string;
  duration?: string;
}

interface CourseModulesAccordionProps {
  modules: Module[];
}

export function CourseModulesAccordion({ modules }: CourseModulesAccordionProps) {
  return (
    <div className="space-y-3 font-mono">
      <h2 className="text-base font-bold text-white flex items-center space-x-2">
        <FiBookOpen className="w-4 h-4 text-sky-400" />
        <span>Curriculum & Lessons</span>
      </h2>

      {modules && modules.length > 0 ? (
        <Accordion.Root defaultValue={["module-0"]} className="space-y-2">
          {modules.map((mod, index) => (
            <Accordion.Item
              key={index}
              value={`module-${index}`}
              className="border border-slate-800 rounded overflow-hidden bg-slate-900"
            >
              <Accordion.ItemTrigger className="w-full flex items-center justify-between p-3.5 text-left font-medium text-slate-200 hover:text-white hover:bg-slate-850 transition">
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 text-[11px] flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold">{mod.title}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <FiClock className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px]">{mod.duration || "15 min"}</span>
                  </span>
                  <FiChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent className="p-3.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                {mod.content || "No lesson content provided."}
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded text-center text-xs text-slate-500">
          No modules added to this course yet.
        </div>
      )}
    </div>
  );
}

