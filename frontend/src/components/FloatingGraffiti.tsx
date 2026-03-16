"use client";

import { useEffect, useState, useRef } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Coins,
  Wallet,
  Scale,
  Gavel,
  FileText,
  ShieldCheck,
  Calculator,
  HandCoins
} from "lucide-react";
import anime from "animejs";

const financeIcons = [DollarSign, TrendingUp, PieChart, BarChart3, Coins, Wallet];
const taxationIcons = [Scale, Gavel, FileText, ShieldCheck, Calculator, HandCoins];

interface GraffitiElement {
  text?: string;
  Icon?: any;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: string;
  opacity?: number;
  rotation?: number;
}

interface FloatingGraffitiProps {
  elements?: GraffitiElement[];
  division?: string;
}

export default function FloatingGraffiti({ elements, division = "finance" }: FloatingGraffitiProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<GraffitiElement[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Determine icons based on division
    const baseIcons = division === "taxation" ? taxationIcons : financeIcons;
    
    // Generate initial positions only on the client to avoid hydration mismatch
    const generatedItems: GraffitiElement[] = (elements || (baseIcons.map((Icon) => ({ Icon })) as GraffitiElement[])).map(item => ({
      ...item,
      top: item.top || `${Math.random() * 90 + 5}%`,
      left: item.left || (item.right ? "auto" : `${Math.random() * 90 + 5}%`),
      rotation: item.rotation || (Math.random() * 40 - 20),
      size: item.size || `${3 + Math.random() * 3}rem`
    }));
    
    setItems(generatedItems);

    const timer = setTimeout(() => {
      if (containerRef.current) {
        anime({
          targets: containerRef.current.querySelectorAll(".floating-graffiti-item"),
          translateY: [0, -30, 0],
          translateX: (el: any, i: number) => [0, (i % 2 === 0 ? 15 : -15), 0],
          rotate: (el: any, i: number) => {
             const baseRot = parseFloat(el.getAttribute('data-rotation') || '0');
             return [baseRot, baseRot + 10, baseRot];
          },
          duration: (el: any, i: number) => 4000 + i * 800,
          easing: "easeInOutQuad",
          loop: true,
          delay: anime.stagger(300),
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [elements, division]);

  if (!mounted) return <div className="absolute inset-0 pointer-events-none" />;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {items.map((item, i) => (
        <div
          key={i}
          className="floating-graffiti-item absolute pointer-events-none"
          data-rotation={item.rotation}
          style={{
            top: item.top,
            left: item.left,
            right: item.right || "auto",
            bottom: item.bottom || "auto",
            opacity: item.opacity || 0.04,
            fontSize: item.size,
            transform: `rotate(${item.rotation}deg)`,
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
