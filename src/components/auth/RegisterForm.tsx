"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field } from "@ark-ui/react";
import { useAuth } from "@/context/AuthContext";
import { FiUserPlus, FiAlertCircle, FiAlertTriangle } from "react-icons/fi";

export function RegisterForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showVulnerabilityDemo, setShowVulnerabilityDemo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = { name, email, password };
      if (showVulnerabilityDemo) {
        payload.role = role;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      await refreshUser();
      router.push("/courses");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded p-6 font-mono">
      <div className="text-center mb-6">
        <div className="inline-flex p-2.5 rounded bg-sky-500/10 text-sky-400 mb-2">
          <FiUserPlus className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white">Create an Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Join the VulnLMS training platform
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
            Full Name
          </Field.Label>
          <Field.Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500 transition"
          />
        </Field.Root>

        <Field.Root className="space-y-1">
          <Field.Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Email Address
          </Field.Label>
          <Field.Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
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

        {/* Security Lab Demonstration Section */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowVulnerabilityDemo(!showVulnerabilityDemo)}
            className="text-[11px] flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-medium"
          >
            <FiAlertTriangle className="w-3.5 h-3.5" />
            <span>{showVulnerabilityDemo ? "Hide" : "Show"} Mass Assignment Lab Demo</span>
          </button>

          {showVulnerabilityDemo && (
            <div className="mt-2.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded text-[11px] space-y-2">
              <p className="text-slate-300">
                <strong className="text-amber-300">Lab Note:</strong> The backend blindly consumes the request body. You can simulate privilege escalation by requesting the <code className="text-amber-400">admin</code> role during signup.
              </p>
              <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                  Inject Role:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="student">student (Normal)</option>
                  <option value="instructor">instructor (Elevated)</option>
                  <option value="admin">admin (Full Privilege Escalation)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition disabled:opacity-50 mt-3"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <p className="text-[11px] text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-sky-400 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

