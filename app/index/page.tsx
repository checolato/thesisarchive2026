"use client";

import { useEffect, useMemo, useState } from "react";
import RippleBackground from "@/components/RippleBackground";
import { getProjects } from "@/lib/loadProjects";
import ProjectGalleryPage, { GalleryProject } from "@/components/ProjectGalleryPage";


export default function IndexPage() {
  const [projects, setProjects] = useState(() => getProjects().slice(0, 200));

  useEffect(() => {
    setProjects(getProjects().slice(0, 200));
  }, []);

  // IMPORTANT: map these fields to match your data
  const galleryProjects: GalleryProject[] = useMemo(() => {
    return projects.map((p: any) => ({
      slug: p.slug,
      project_name: p.project_name,
      category: p.category ?? "Category 1",
    }));
  }, [projects]);

  return (
    <>
      <RippleBackground />

      {/* page container */}
      <main className="min-h-screen px-0 py-0 bg-white">
        <ProjectGalleryPage projects={galleryProjects} defaultCategory="Category 1" />
      </main>
    </>
  );
}
