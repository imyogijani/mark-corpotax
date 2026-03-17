"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface ChangeDivisionButtonProps {
    className?: string;
    shouldAnimate?: boolean;
    onReset?: () => void;
}

export function ChangeDivisionButton({ className, shouldAnimate = true, onReset }: ChangeDivisionButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Magnetic effect values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleClick = () => {
        if (onReset) {
            onReset();
        } else {
            localStorage.removeItem("user_division");
            window.location.href = "/";
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!shouldAnimate || !buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center (magnetic pull)
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Limit the pull range
        x.set(distanceX * 0.35);
        y.set(distanceY * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
                x: springX,
                y: springY,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative px-8 py-3 rounded-full bg-slate-950 border border-white/5 transition-colors duration-500 overflow-hidden ${className}`}
        >
            {/* Animated Border Trace (Visible only on Home) */}
            {shouldAnimate && (
                <div className="absolute inset-0 rounded-full">
                    <div className="absolute inset-[-2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-[1px] bg-slate-950 rounded-full z-0" />
                </div>
            )}

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-cyan-600/0 group-hover:from-indigo-600/20 group-hover:to-cyan-600/20 transition-all duration-700 z-0" />

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center gap-2 text-white text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Change Division
            </span>

            {/* Corner Shine */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.button>
    );
}
