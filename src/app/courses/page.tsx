"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { CourseCard, CourseItem } from "@/components/courses/CourseCard";
import { CourseFilterBar } from "@/components/courses/CourseFilterBar";
import { CourseEmptyState } from "@/components/courses/CourseEmptyState";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let url = `/api/courses?`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (category && category !== "all") url += `category=${encodeURIComponent(category)}`;

      const res = await fetch(url);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const seedSampleCourses = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Course Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through courses, download materials, and inspect module syllabi
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {courses.length === 0 && user && (
            <button
              onClick={seedSampleCourses}
              disabled={seeding}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/20 text-xs font-semibold transition"
            >
              <LuSparkles className="w-3.5 h-3.5" />
              <span>{seeding ? "Seeding..." : "Seed Sample Courses"}</span>
            </button>
          )}
          {user && (
            <Link
              href="/courses/new"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition"
            >
              <FiPlusCircle className="w-3.5 h-3.5" />
              <span>Create Course</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Bar Component */}
      <CourseFilterBar
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded bg-slate-900/60 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <CourseEmptyState
          user={user}
          seeding={seeding}
          onSeed={seedSampleCourses}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
