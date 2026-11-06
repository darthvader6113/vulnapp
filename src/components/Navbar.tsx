"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LuGraduationCap } from "react-icons/lu";
import { FiBookOpen, FiAlertTriangle, FiPlusCircle, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 text-sky-400 font-bold text-lg tracking-tight">
            <LuGraduationCap className="w-6 h-6" />
            <span>Vuln<span className="text-white">LMS</span></span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Lab
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium">
            <Link
              href="/courses"
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <FiBookOpen className="w-4 h-4" />
              <span>Browse Courses</span>
            </Link>
            <Link
              href="/security-lab"
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <FiAlertTriangle className="w-4 h-4" />
              <span>Security Lab</span>
            </Link>
            {user && (
              <Link
                href="/courses/new"
                className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <FiPlusCircle className="w-4 h-4" />
                <span>Create Course</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {loading ? (
            <div className="h-8 w-24 bg-slate-800 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-200 font-medium">{user.name}</span>
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono font-semibold ${
                  user.role === "admin"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : user.role === "instructor"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "bg-slate-800 text-slate-300"
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded border border-slate-800 transition"
                title="Sign out"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded border border-slate-800 transition"
              >
                <FiLogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center space-x-1.5 text-xs text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded font-medium transition"
              >
                <FiUserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
