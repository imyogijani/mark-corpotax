import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  animation?: 'pulse' | 'bounce' | 'spin' | 'float' | 'scale' | 'wiggle';
}

export function AnimatedIcon({ 
  icon: Icon, 
  className = "", 
  size = 24, 
  animation = 'float' 
}: AnimatedIconProps) {
  const animationClasses = {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
    float: 'animate-float',
    scale: 'animate-scale-up',
    wiggle: 'animate-wiggle'
  };

  return (
    <div className={`inline-block ${animationClasses[animation]} ${className}`}>
      <Icon size={size} />
    </div>
  );
}

// Predefined animated icons for common use cases
export function AnimatedBarChart({ className = "", size = 64 }) {
  return (
    <div className={`relative ${className}`}>
      <div>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      </div>
    </div>
  );
}

export function AnimatedBriefcase({ className = "", size = 64 }) {
  return (
    <div className={`relative ${className}`}>
      <div>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
    </div>
  );
}

export function AnimatedHandCoins({ className = "", size = 64 }) {
  return (
    <div className={`relative ${className}`}>
      <div>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1-.4-1-1V9a2 2 0 1 1 4 0" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      </div>
    </div>
  );
}

export function AnimatedPhone({ className = "", size = 64 }) {
  return (
    <div className={`relative ${className}`}>
      <div>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
    </div>
  );
}

export function AnimatedMail({ className = "", size = 64 }) {
  return (
    <div className={`relative ${className}`}>
      <div>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </svg>
      </div>
    </div>
  );
}