"use client";

import React, { useEffect, useMemo, useState } from "react";

export type GalleryProject = {
  slug: string;
  project_name: string;
  category: string;
};

function formatCategory(label: string) {
  return label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProjectGalleryPage({
  projects,
  defaultCategory,
}: {
  projects: GalleryProject[];
  defaultCategory?: string;
}) {
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category))).filter(Boolean);
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState<string>("");

  // Pick a valid category whenever data changes
  useEffect(() => {
    if (defaultCategory && categories.includes(defaultCategory)) {
      setActiveCategory(defaultCategory);
    } else if (categories.length > 0) {
      setActiveCategory(categories[0]);
    } else {
      setActiveCategory("");
    }
  }, [defaultCategory, categories]);

  const listFor = (cat: string) => projects.filter((p) => p.category === cat);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <div className="text-[64px] text-black/80">Index</div>
        <a
          href="/"
          className="text-[14px] text-black/50 hover:text-black transition"
        >
          Close
        </a>
      </div>

      <div className="w-full h-px bg-black/40" />

      <div className="w-full text-center">
        {categories.map((cat, index) => {
          const isActive = cat === activeCategory;

          return (
            <div key={cat}>
              <button
                onClick={() => setActiveCategory(cat)}
                className={[
                  "w-full",
                  "flex justify-center items-center",
                  "h-[101px]",
                  index === 0 ? "border-t border-black/40" : "",
                  "border-b border-black/40",
                  "text-[64px]",
                  "transition-colors",
                  isActive ? "text-black" : "text-black/40 hover:text-black",
                ].join(" ")}
              >
                {formatCategory(cat)}
              </button>

              {isActive &&
                listFor(cat).map((p) => (
                  <a
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="block text-[32px] text-black/75 hover:text-black transition text-center"
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
