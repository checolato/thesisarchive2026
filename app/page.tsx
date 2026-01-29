"use client";

import { useEffect, useMemo, useState } from "react";
import RippleBackground from "@/components/RippleBackground";
import FloatingFrames from "@/components/FloatingFrames";
import ProjectGalleryModal from "@/components/ProjectGalleryModal";
import { getProjects } from "@/lib/loadProjects";

export default function Home() {
  // World size (bigger than viewport) => browser scrollbars appear naturally
  const worldW = 2600;
  const worldH = 1800;

  const [projects, setProjects] = useState(() => getProjects().slice(0, 20));

  // Index/Gallery modal open state
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Optional: keep it stable if getProjects reads from disk on hot reload
  useEffect(() => {
    setProjects(getProjects().slice(0, 20));
  }, []);

  // Map projects into the shape the Gallery modal needs
  // IMPORTANT: change `p.category` to your real field name if different.
  const galleryProjects = useMemo(() => {
    return projects.map((p: any) => ({
      slug: p.slug,
      project_name: p.project_name,
      category: p.category ?? "Category 1",
    }));
  }, [projects]);

  return (
    <>
      {/* Background layer (fixed) */}
      <RippleBackground />

      {/* Index tab (fixed to viewport, not inside world) */}
      <a
        href="/index"
        className="fixed z-50 right-[100px] top-[40px] text-[11px] uppercase tracking-[0.18em] text-black/60 hover:text-black transition"
      >
        Index
      </a>



      {/* The scrollable world */}
      <main
        className="relative"
        style={{
          width: worldW,
          height: worldH,
        }}
      >
        <FloatingFrames worldW={worldW} worldH={worldH} projects={projects} />
      </main>

      {/* Gallery overlay */}
      <ProjectGalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        projects={galleryProjects}
        defaultCategory="Category 1"
      />
    </>
  );
}
