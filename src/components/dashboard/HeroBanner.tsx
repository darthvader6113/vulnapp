"use client";

import Link from "next/link";
import { FiBookOpen, FiAlertTriangle, FiPlusCircle, FiArrowRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export function HeroBanner() {
  const { user } = useAuth();

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <span>Next.js 14 • Ark UI • TypeScript • MongoDB</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Educational Vulnerable <span className="text-sky-400">LMS Platform</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          A real-world Learning Management System built for security training, SAST code review,
          and defensive engineering. Features real authentication, course authoring, file uploads,
          and clearly marked OWASP architectural flaws.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/courses"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition"
          >
            <FiBookOpen className="w-3.5 h-3.5" />
            <span>Explore Courses</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/security-lab"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
          >
            <FiAlertTriangle className="w-3.5 h-3.5" />
            <span>Audit Security Lab</span>
          </Link>
          {user ? (
            <Link
              href="/courses/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <FiPlusCircle className="w-3.5 h-3.5" />
              <span>Create New Course</span>
            </Link>
          ) : (
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <span>Get Started (Sign Up)</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

