"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectGalleryPage from "@/components/ProjectGalleryPage";
import { getProjects } from "@/lib/loadProjects";

export default function IndexPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const galleryProjects = useMemo(() => {
    return projects
      .filter((p: any) => p?.category && p?.slug && p?.project_name)
      .map((p: any) => ({
        slug: p.slug,
        project_name: p.project_name,
        category: p.category,
      }));
  }, [projects]);

  return (
    <main className="min-h-screen bg-white">
      <ProjectGalleryPage projects={galleryProjects} />
    </main>
  );
}
