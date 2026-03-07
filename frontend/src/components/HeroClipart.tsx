"use client";

import React from "react";
import Lottie from "lottie-react";
import animationData from "../../public/Isometric data analysis.json";

export default function HeroClipart() {
  return (
    <div className="relative w-full aspect-square max-w-[550px] flex items-center justify-center scale-110">
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-full h-full drop-shadow-[0_20px_50px_rgba(11,76,128,0.15)]"
      />
    </div>
  );
}
