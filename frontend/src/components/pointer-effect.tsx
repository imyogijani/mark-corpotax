"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PointerEffect() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth out the movement
  const springConfig = { damping: 25, stiffness: 250, restDelta: 0.001 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isClient, mouseX, mouseY]);

  if (!isClient) return null;

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed left-0 top-0 rounded-full bg-blue-500/20 blur-2xl z-[9999] hidden md:block mix-blend-multiply",
        isHovering ? "w-48 h-48" : "w-24 h-24"
      )}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      transition={{
        width: { duration: 0.4, ease: "easeOut" },
        height: { duration: 0.4, ease: "easeOut" }
      }}
    />
  );
}
