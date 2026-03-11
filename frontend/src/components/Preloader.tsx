"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo-image";
import { useLoading } from "@/contexts/LoadingContext";

export default function Preloader() {
  const { isLoading, setIsLoading } = useLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Fast but smooth progress

    return () => clearInterval(interval);
  }, [setIsLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617]"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1],
              delay: 0.2
            } 
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <motion.div 
              className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[120px]"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-32 h-32 mb-8"
            >
              <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-125" />
              <motion.div 
                className="absolute inset-0 rounded-full border-t-2 border-blue-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="flex items-center justify-center w-full h-full p-6">
                <Logo className="w-full h-full object-contain brightness-0 invert" />
              </div>
            </motion.div>

            {/* Title with Gradient */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-[0.2em] text-white">
                MARK <span className="text-blue-500">GROUP</span>
              </h1>
              <motion.div 
                className="mt-2 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              <p className="mt-4 text-xs font-medium text-blue-400 uppercase tracking-[0.4em] opacity-80">
                Shaping Financial Success
              </p>
            </motion.div>

            {/* Progress Counter */}
            <div className="absolute top-[calc(100%+3rem)] flex flex-col items-center">
              <span className="text-4xl font-mono text-white/20 tabular-nums">
                {progress.toString().padStart(3, '0')}
              </span>
              <div className="w-64 h-[2px] bg-white/5 mt-4 overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
