"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function PointerEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 blur-lg transition-transform duration-300 ease-in-out z-[9999] hidden md:block",
        isHovering ? "w-16 h-16" : "w-8 h-8"
      )}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
}
