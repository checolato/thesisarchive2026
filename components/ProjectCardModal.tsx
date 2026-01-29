"use client";
import { useEffect } from "react";

type ProjectCardData = {
  slug: string;
  title: string;
  desc?: string;
  img?: string;
};

export default function ProjectCardModal({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: ProjectCardData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* card */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative w-[980px] h-[560px] rounded-[28px] bg-white shadow-xl overflow-hidden"
          onClick={onClose}
          role="button"
          tabIndex={0}
        >
            
          
          {/* your UI starts here */}
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-5 p-10">
              <h1 className="text-5xl leading-tight text-black">
                {project.title}
              </h1>
              <p className="mt-4 text-black">
                {project.desc}
              </p>
            </div>

            <div className="col-span-7 p-8">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-black/10">
                {project.img && (
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
