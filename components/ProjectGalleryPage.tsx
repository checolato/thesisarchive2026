"use client";

import React, { useEffect, useMemo, useState } from "react";

export type GalleryProject = {
  slug: string;
  project_name: string;
  category: string;
};

export default function ProjectGalleryPage({
  projects,
  defaultCategory,
}: {
  projects: GalleryProject[];
  defaultCategory?: string;
}) {
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category)));
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState(
    defaultCategory ?? categories[0]
  );

  useEffect(() => {
    if (defaultCategory) setActiveCategory(defaultCategory);
  }, [defaultCategory]);

  const listFor = (cat: string) =>
    projects.filter((p) => p.category === cat);
  
  function formatCategory(label: string) {
  return label
    .replace(/-/g, " ")                 // remove dashes
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
}

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full flex items-center px-10 justify-between">
        <div className="text-[64px] text-black/80">Index</div>

        <a
          href="/"
          className="fixed z-50 right-[100px] top-[40px] text-[11px] uppercase tracking-[0.18em] text-black/60 hover:text-black transition"
        >
          Close
        </a>
      </div>

      {/* Divider */}
      <div className="w-full bg-black/40" />

      {/* Categories */}
      <div className="w-full text-center ">
        {categories.map((cat, index) => {
          const isActive = cat === activeCategory;

          return (
            <div key={cat}>
              {/* Category tab */}
              <button
                onClick={() => setActiveCategory(cat)}
                className={[
                  "w-full",
                  "flex justify-center items-center",
                  "h-[101px]",
                  index === 0 ? "border-t border-black/40" : "",
                  "border-b border-black/40",
                  "text-[64px]",
                  "transition-colors duration-200",
                  isActive
                    ? "text-black"
                    : "text-black/40 hover:text-black",
                ].join(" ")}
              >
                {formatCategory(cat)}
              </button>


              {/* Project list */}
              {isActive &&
                listFor(cat).map((p) => (
                  <a
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className={[
                      "block text-[24px] text-black/40 hover:text-black transition text-center",
                      index === 0 ? "border-t border-black/40" : "",
                      "border-b border-black/80",
                    ].join(" ")}
                  >
                    {p.project_name}
                  </a>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
