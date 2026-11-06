"use client";

import { useEffect, useState } from "react";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { FeatureTabs } from "@/components/dashboard/FeatureTabs";

export default function Home() {
  const [coursesCount, setCoursesCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCoursesCount(data.courses.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 font-mono">
      <HeroBanner />
      <StatsGrid coursesCount={coursesCount} />
      <FeatureTabs />
    </div>
  );
}
