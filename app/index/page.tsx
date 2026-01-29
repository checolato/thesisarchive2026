"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectGalleryPage from "@/components/ProjectGalleryPage";
import { getProjects } from "@/lib/loadProjects";

export default function IndexPage() {
  return (
    <div style={{ background: "yellow", fontSize: 48, padding: 40 }}>
      INDEX MARKER ✅
    </div>
  );
}
