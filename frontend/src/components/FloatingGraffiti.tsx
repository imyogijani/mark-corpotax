"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Coins,
  Wallet,
} from "lucide-react";

const icons = [DollarSign, TrendingUp, PieChart, BarChart3, Coins, Wallet];

import anime from "animejs";

interface GraffitiElement {
  text?: string;
  Icon?: any;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: string;
  opacity?: number;
}

interface FloatingGraffitiProps {
  elements?: GraffitiElement[];
}

export default function FloatingGraffiti({ elements }: FloatingGraffitiProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    anime({
      targets: ".floating-graffiti-item",
      translateY: [0, -20, 0],
      rotate: [0, 5, 0],
      duration: (el: any, i: number) => 3000 + i * 500,
      easing: "easeInOutQuad",
      loop: true,
      delay: anime.stagger(200),
    });
  }, []);

  if (!mounted) return null;

  // Use provided elements or default icons if none provided
  const items: GraffitiElement[] = elements || icons.map((Icon) => ({ Icon }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item, i) => (
        <div
          key={i}
          className="floating-graffiti-item absolute select-none pointer-events-none"
          style={{
            top: item.top || `${Math.random() * 100}%`,
            left:
              item.left || (item.right ? "auto" : `${Math.random() * 100}%`),
            right: item.right || "auto",
            bottom: item.bottom || "auto",
            opacity: item.opacity || 0.05,
            fontSize: item.size || "4rem",
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
          }}
        >
          {item.text ? (
            <span className="font-black italic text-slate-900/10 dark:text-white/10 uppercase tracking-tighter">
              {item.text}
            </span>
          ) : item.Icon ? (
            <item.Icon
              size={64}
              className="text-slate-900/10 dark:text-white/10"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
