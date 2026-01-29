"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  viewX: number;
  viewY: number;
  setViewX: (n: number) => void;
  setViewY: (n: number) => void;
  worldW: number;
  worldH: number;
};

export default function WorldSliders({
  viewX,
  viewY,
  setViewX,
  setViewY,
  worldW,
  worldH,
}: Props) {
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { maxX, maxY } = useMemo(() => {
    return {
      maxX: Math.max(0, worldW - vw),
      maxY: Math.max(0, worldH - vh),
    };
  }, [worldW, worldH, vw, vh]);

  return (
    <>
      {/* bottom slider */}
      <div className="fixed left-8 right-16 bottom-8 z-20">
        <input
          type="range"
          min={0}
          max={maxX}
          value={Math.min(viewX, maxX)}
          onChange={(e) => setViewX(Number(e.target.value))}
          className="w-full accent-black/60"
        />
      </div>

      {/* right slider */}
      <div className="fixed top-16 bottom-16 right-8 z-20 flex items-center">
        <input
          type="range"
          min={0}
          max={maxY}
          value={Math.min(viewY, maxY)}
          onChange={(e) => setViewY(Number(e.target.value))}
          className="h-full accent-black/60"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        />
      </div>
    </>
  );
}
