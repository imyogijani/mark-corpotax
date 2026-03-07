"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

interface CurtainTransitionProps {
  onComplete?: () => void;
}

export default function CurtainTransition({
  onComplete,
}: CurtainTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Number of columns for the curtain
    const cols = 10;

    // Animate the curtain panels
    animate(".curtain-panel", {
      scaleY: [1, 0],
      duration: 1000,
      easing: "easeInOutQuart",
      delay: stagger(100, { from: "center" }),
      complete: () => {
        if (onComplete) onComplete();
      },
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex pointer-events-none"
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="curtain-panel flex-1 bg-slate-900 origin-top h-full"
        />
      ))}
    </div>
  );
}
