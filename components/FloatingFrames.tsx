"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ProjectCardModal from "@/components/ProjectCardModal";

/* ---------- Types ---------- */

export type ProjectLite = {
  slug: string;
  project_name: string;
  project_description?: string;
  image?: string;
};

type Frame = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
};

type Props = {
  worldW: number;
  worldH: number;
  projects: ProjectLite[];
};

/* ---------- Config ---------- */

const SIZE = 300;

/* ---------- Component ---------- */

export default function FloatingFrames({
  worldW,
  worldH,
  projects,
}: Props) {
  const framesRef = useRef<Frame[]>([]);
  const [, forceRender] = useState(0);

  /* ---------- Selected project (modal state) ---------- */

  const [selected, setSelected] = useState<{
    slug: string;
    title: string;
    desc?: string;
    img?: string;
  } | null>(null);

  /* ---------- Pointer state (WORLD coordinates) ---------- */

  const pointer = useRef({
    x: 0,
    y: 0,
    down: false,
    draggingId: -1,
    dragDx: 0,
    dragDy: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  /* ---------- Initial frame layout ---------- */

  const initialFrames = useMemo(() => {
    const pad = 140;
    const usableW = Math.max(1, worldW - SIZE - pad * 2);
    const usableH = Math.max(1, worldH - SIZE - pad * 2);

    return projects.map((p, i) => ({
      id: i,
      x: pad + ((i * 390) % usableW),
      y: pad + ((i * 270) % usableH),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      rot: (Math.random() - 0.5) * 0.14,
      vr: (Math.random() - 0.5) * 0.0012,
      slug: p.slug,
      title: p.project_name,
      desc: p.project_description,
      img: p.image,
    }));
  }, [projects, worldW, worldH]);

  useEffect(() => {
    framesRef.current = initialFrames;
  }, [initialFrames]);

  /* ---------- Scroll tracking (avoid jitter) ---------- */

  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      lastScroll.current = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Physics loop ---------- */

  useEffect(() => {
    let raf = 0;

    const step = () => {
      const frames = framesRef.current;

      const drag = 0.992;
      const drift = 0.022;
      const bounce = 0.48;

      const px = pointer.current.x;
      const py = pointer.current.y;
      const scrollingRecently =
        performance.now() - lastScroll.current < 120;

      for (const f of frames) {
        const cx = f.x + SIZE / 2;
        const cy = f.y + SIZE / 2;

        const t = performance.now() * 0.00025;
        f.vx += Math.sin(cy * 0.002 + t) * drift;
        f.vy += Math.cos(cx * 0.002 + t) * drift;

        // cursor push
        if (!pointer.current.down && !scrollingRecently) {
          const dx = cx - px;
          const dy = cy - py;
          const dist = Math.hypot(dx, dy);
          const radius = 260;

          if (dist < radius) {
            const strength = (1 - dist / radius) * 0.3;
            f.vx += (dx / (dist + 0.0001)) * strength;
            f.vy += (dy / (dist + 0.0001)) * strength;
            f.vr += strength * 0.001 * (dx > 0 ? 1 : -1);
          }
        }

        // dragging
        if (
          pointer.current.down &&
          pointer.current.draggingId === f.id
        ) {
          f.x = px + pointer.current.dragDx;
          f.y = py + pointer.current.dragDy;
          f.vx *= 0.82;
          f.vy *= 0.82;
          f.vr *= 0.9;
        } else {
          f.x += f.vx;
          f.y += f.vy;
          f.rot += f.vr;

          f.vx *= drag;
          f.vy *= drag;
          f.vr *= 0.995;

          // bounds
          if (f.x < 0) {
            f.x = 0;
            f.vx = Math.abs(f.vx) * bounce;
          }
          if (f.y < 0) {
            f.y = 0;
            f.vy = Math.abs(f.vy) * bounce;
          }
          if (f.x > worldW - SIZE) {
            f.x = worldW - SIZE;
            f.vx = -Math.abs(f.vx) * bounce;
          }
          if (f.y > worldH - SIZE) {
            f.y = worldH - SIZE;
            f.vy = -Math.abs(f.vy) * bounce;
          }
        }
      }

      forceRender((n) => (n + 1) % 1_000_000);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [worldW, worldH]);

  /* ---------- Pointer handlers ---------- */

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    pointer.current.x = e.clientX + window.scrollX;
    pointer.current.y = e.clientY + window.scrollY;

    const dx = pointer.current.x - pointer.current.startX;
    const dy = pointer.current.y - pointer.current.startY;
    if (Math.hypot(dx, dy) > 6) pointer.current.moved = true;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (selected) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    pointer.current.down = true;
    pointer.current.x = e.clientX + window.scrollX;
    pointer.current.y = e.clientY + window.scrollY;
    pointer.current.startX = pointer.current.x;
    pointer.current.startY = pointer.current.y;
    pointer.current.moved = false;

    const frames = framesRef.current;
    pointer.current.draggingId = -1;

    for (let i = frames.length - 1; i >= 0; i--) {
      const f = frames[i];
      if (
        pointer.current.x >= f.x &&
        pointer.current.x <= f.x + SIZE &&
        pointer.current.y >= f.y &&
        pointer.current.y <= f.y + SIZE
      ) {
        pointer.current.draggingId = f.id;
        pointer.current.dragDx = f.x - pointer.current.x;
        pointer.current.dragDy = f.y - pointer.current.y;

        frames.splice(i, 1);
        frames.push(f);
        break;
      }
    }
  }

  function onPointerUp() {
    if (!selected && !pointer.current.moved) {
      const f = framesRef.current.find(
        (ff) => ff.id === pointer.current.draggingId
      );
      if (f) {
        setSelected({
          slug: f.slug,
          title: f.title,
          desc: f.desc,
          img: f.img,
        });
      }
    }

    pointer.current.down = false;
    pointer.current.draggingId = -1;
  }

  /* ---------- Render ---------- */

  const frames = framesRef.current;

  return (
    <>
      <div
        className="absolute left-0 top-0"
        style={{
          width: worldW,
          height: worldH,
          touchAction: "none",
        }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {frames.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-[26px] bg-white/18 backdrop-blur-[2px] shadow-sm overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
            style={{
              width: SIZE,
              height: SIZE,
              left: f.x,
              top: f.y,
              transform: `rotate(${f.rot}rad)`,
              willChange: "transform,left,top",
            }}
            title={f.title}
          >
            {f.img ? (
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover opacity-90 select-none pointer-events-none"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-black/10" />
            )}
          </div>
        ))}
      </div>

      <ProjectCardModal
        open={!!selected}
        project={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
