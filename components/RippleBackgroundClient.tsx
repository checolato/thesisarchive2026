"use client";

import WaterWave from "react-water-wave";

export default function RippleBackgroundClient() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ width: "100vw", height: "100vh" }}
    >
      <WaterWave
        imageUrl="/images/background.jpeg"
        resolution={1024}
        dropRadius={28}
        perturbance={0.4}
        interactive
        style={{ width: "100%", height: "100%" }}
      >
        {() => <div style={{ width: "100vw", height: "100vh" }} />}
      </WaterWave>
    </div>
  );
}
