"use client";

import React, { useEffect, useMemo, useState } from "react";

export type GalleryProject = {
  slug: string;
  project_name: string;
  category: string; // should be "Category 1" ... "Category 5"
};

type Props = {
  open: boolean;
  onClose: () => void;
  projects: GalleryProject[];
  defaultCategory?: string; // default open category on enter
};

export default function ProjectGalleryModal({
  open,
  onClose,
  projects,
  defaultCategory = "Category 1",
}: Props) {
  // Category order matching your UI mock: Category 1 first, then others. :contentReference[oaicite:1]{index=1}
  const categories = useMemo(() => {
    const preferred = ["Category 1", "Category 2", "Category 5", "Category 4", "Category 3"];
    const uniq = Array.from(new Set(projects.map((p) => p.category)));

    // If your data already uses Category 1..5, this will keep the UI order.
    // If some categories are missing from data, still show them (optional).
    const merged = Array.from(new Set([...preferred, ...uniq]));
    return merged;
  }, [projects]);

  // exclusive accordion: only one open at a time
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  // When opening modal, auto-open Category 1 (or your default) :contentReference[oaicite:2]{index=2}
  useEffect(() => {
    if (!open) return;
    setActiveCategory(defaultCategory);
  }, [open, defaultCategory]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const listFor = (cat: string) => projects.filter((p) => p.category === cat);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop (click closes) */}
      <button
        className="absolute inset-0 w-full h-full bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close gallery"
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className="relative w-[min(1100px,92vw)] h-[min(720px,84vh)] rounded-[28px] bg-white shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-10 pt-8">
            <div className="text-[22px] tracking-wide text-black/80 select-none">
              Gallery
            </div>

            <button
              onClick={onClose}
              className="text-sm px-3 py-1 rounded-full bg-black/5 hover:bg-black/10 transition"
            >
              Back
            </button>
          </div>

          <div className="mt-4 h-px bg-black/10" />

          {/* Body: left accordion + big empty right space (like your mock) */}
          <div className="grid grid-cols-12 h-[calc(100%-84px-1px)]">
            {/* Left accordion */}
            <div className="col-span-4 px-10 py-6">
              <div className="space-y-4">
                {categories.map((cat) => {
                  const isActive = cat === activeCategory;
                  const list = isActive ? listFor(cat) : [];

                  return (
                    <div key={cat}>
                      {/* Category title */}
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={[
                          "w-full text-left",
                          "text-[18px] tracking-wide",
                          "transition",
                          isActive ? "text-black" : "text-black/55 hover:text-black/80",
                        ].join(" ")}
                      >
                        {cat}
                      </button>

                      {/* Expanded project list (only for active category) */}
                      {isActive && (
                        <div className="mt-3 ml-0 space-y-2">
                          {list.length > 0 ? (
                            list.map((p) => (
                              <a
                                key={p.slug}
                                href={`/projects/${p.slug}`}
                                className="block text-[18px] text-black/70 hover:text-black transition"
                                // If you want the modal to close after clicking a project:
                                // onClick={onClose}
                              >
                                {p.project_name}
                              </a>
                            ))
                          ) : (
                            <div className="text-sm text-black/45">
                              No projects in this category.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right blank area (keeps the same big white field from your UI mock) */}
            <div className="col-span-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
