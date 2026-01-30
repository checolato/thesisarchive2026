"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RippleBackground from "@/components/RippleBackground";
import FloatingFrames from "@/components/FloatingFrames";
import { getProjects } from "@/lib/loadProjects";

export default function Home() {
  const worldW = 2600;
  const worldH = 1800;

  const [projects, setProjects] = useState(() =>
    getProjects().slice(0, 20)
  );

  useEffect(() => {
    setProjects(getProjects().slice(0, 20));
  }, []);

  return (
    <>
      {/* Background */}
      <RippleBackground />

      {/* Index tab — REAL PAGE NAVIGATION */}
      <Link
        href="/app/index"
        prefetch={false}
        className="fixed z-[9999] right-[100px] top-[40px] text-[11px] uppercase tracking-[0.18em] text-black/60 hover:text-black transition"
      >
        Index
      </Link>

      <Link href="/index"></Link>

      {/* Scrollable world */}
      <main
        className="relative"
        style={{
          width: worldW,
          height: worldH,
        }}
      >
        <FloatingFrames
          worldW={worldW}
          worldH={worldH}
          projects={projects}
        />
      </main>
    </>
  );
}
