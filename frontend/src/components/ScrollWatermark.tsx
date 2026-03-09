"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

interface ScrollWatermarkProps {
  text: string;
  className?: string;
}

export default function ScrollWatermark({
  text,
  className,
}: ScrollWatermarkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && textRef.current) {
            anime({
              targets: textRef.current,
              strokeDashoffset: [
                (el: any) => {
                  try {
                    // SVGTextElement may not have getTotalLength in all browsers
                    const l =
                      typeof el.getTotalLength === "function"
                        ? el.getTotalLength()
                        : el.getComputedTextLength
                          ? el.getComputedTextLength() * 2
                          : 1000;

                    el.setAttribute("stroke-dasharray", l);
                    return l;
                  } catch (e) {
                    return 1000;
                  }
                },
                0,
              ],
              duration: 2500,
              easing: "easeInOutQuart",
              opacity: [0, 0.05],
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`absolute pointer-events-none select-none ${className}`}
      viewBox="0 0 800 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        ref={textRef}
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-none stroke-slate-300 stroke-[0.5] font-black italic text-8xl tracking-[1rem] opacity-0"
      >
        {text}
      </text>
    </svg>
  );
}
