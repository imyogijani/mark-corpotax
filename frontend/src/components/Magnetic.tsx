"use client";

import React, { useRef, useState, useEffect } from "react";
import anime from "animejs";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
  const magneticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!magneticRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } =
        magneticRef.current.getBoundingClientRect();

      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = width * 1.5;

      if (distance < maxDistance) {
        anime({
          targets: magneticRef.current,
          translateX: x * strength,
          translateY: y * strength,
          duration: 800,
          easing: "easeOutElastic(1, .8)",
        });
      } else {
        anime({
          targets: magneticRef.current,
          translateX: 0,
          translateY: 0,
          duration: 1000,
          easing: "easeOutElastic(1, .5)",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength]);

  return (
    <div
      ref={magneticRef}
      className="inline-block transition-transform duration-300 ease-out"
    >
      {children}
    </div>
  );
}
