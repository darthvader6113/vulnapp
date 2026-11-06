"use client";

import { Tabs } from "@ark-ui/react";
import { FiBookOpen, FiFileText, FiLock } from "react-icons/fi";

const SECURITY_TOPICS = [
  { title: "BOLA / IDOR", cwe: "CWE-639", desc: "Missing ownership verification in Course update and delete routes." },
  { title: "Mass Assignment", cwe: "CWE-915", desc: "Registration payload allows privilege escalation to admin." },
  { title: "Insecure File Upload", cwe: "CWE-434", desc: "Permissive file extension handling and public directory storage." },
  { title: "NoSQL Injection", cwe: "CWE-943", desc: "Unsanitized query filter objects passed into MongoDB find()." },
  { title: "Missing RBAC Checks", cwe: "CWE-285", desc: "Non-instructor roles can call course authoring endpoints." },
  { title: "Weak Auth Configuration", cwe: "CWE-326", desc: "Hardcoded default JWT secret and weak password validation." },
];

export function FeatureTabs() {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded p-6">
      <Tabs.Root defaultValue="features" className="w-full">
        <Tabs.List className="flex border-b border-slate-800 mb-6">
          <Tabs.Trigger
            value="features"
            className="px-3.5 py-1.5 font-medium text-xs text-slate-400 data-[selected]:text-sky-400 data-[selected]:border-b-2 data-[selected]:border-sky-400 transition"
          >
            LMS Core Features
          </Tabs.Trigger>
          <Tabs.Trigger
            value="security"
            className="px-3.5 py-1.5 font-medium text-xs text-slate-400 data-[selected]:text-amber-400 data-[selected]:border-b-2 data-[selected]:border-amber-400 transition"
          >
            Security Lab Topics (OWASP)
          </Tabs.Trigger>
          <Tabs.Trigger
            value="docker"
            className="px-3.5 py-1.5 font-medium text-xs text-slate-400 data-[selected]:text-emerald-400 data-[selected]:border-b-2 data-[selected]:border-emerald-400 transition"
          >
            Docker & Architecture
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded">
              <div className="w-8 h-8 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5">
                <FiLock className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Real Authentication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full registration & login workflows using bcrypt password hashing, JWT cookies, and role-based accounts.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded">
              <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5">
                <FiBookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Course Authoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full curriculum structuring with interactive Ark UI Accordion modules, syllabi, categories, and published toggles.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded">
              <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <FiFileText className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Ark UI File Upload</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Headless Ark UI drag-and-drop file upload component allowing instructors to attach course materials and slides.
              </p>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="security" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SECURITY_TOPICS.map((item, i) => (
              <div key={i} className="p-3.5 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-amber-300 text-xs">{item.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.cwe}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="docker" className="space-y-4">
          <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-300">
            <p className="text-emerald-400 font-semibold mb-2"># Quickstart with Docker Compose:</p>
            <p className="text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">docker compose up --build</p>
            <p className="text-slate-500 mt-2 text-[11px]"># Runs Next.js 14 standalone app + MongoDB 7.0 container with persistent volumes</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}

