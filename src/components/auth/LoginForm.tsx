"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field } from "@ark-ui/react";
import { useAuth } from "@/context/AuthContext";
import { FiLogIn, FiAlertCircle } from "react-icons/fi";

export function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      await refreshUser();
      router.push("/courses");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: "student" | "instructor") => {
    if (role === "student") {
      setEmail("student@vulnlms.local");
      setPassword("password123");
    } else {
      setEmail("instructor@vulnlms.local");
      setPassword("password123");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded p-6 font-mono">
      <div className="text-center mb-6">
        <div className="inline-flex p-2.5 rounded bg-sky-500/10 text-sky-400 mb-2">
          <FiLogIn className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to VulnLMS</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your courses, materials, and learning tracks
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field.Root className="space-y-1">
          <Field.Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Email Address
          </Field.Label>
          <Field.Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500 transition"
          />
        </Field.Root>

        <Field.Root className="space-y-1">
          <Field.Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Password
          </Field.Label>
          <Field.Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500 transition"
          />
        </Field.Root>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition disabled:opacity-50 mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <p className="text-[11px] text-slate-400 mb-2">Need a test account?</p>
        <div className="flex justify-center space-x-2">
          <button
            type="button"
            onClick={() => fillDemoAccount("student")}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Fill Student
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("instructor")}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Fill Instructor
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-4">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/register" className="text-sky-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

