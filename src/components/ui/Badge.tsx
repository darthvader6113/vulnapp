import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sky" | "amber" | "rose" | "indigo" | "emerald" | "slate";
  className?: string;
}

export function Badge({ children, variant = "slate", className = "" }: BadgeProps) {
  const variantStyles = {
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    rose: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  }[variant];

  return (
    <span
      className={`inline-flex items-center text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded border ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}

