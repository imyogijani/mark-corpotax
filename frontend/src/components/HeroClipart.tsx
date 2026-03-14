"use client";

import React from "react";
import Lottie from "lottie-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import financeAnimationData from "../../public/Isometric data analysis.json";

export default function HeroClipart({ division }: { division: string }) {
  return (
    <div className="relative w-full aspect-square max-w-[550px] flex items-center justify-center scale-110">
      {division === "taxation" ? (
        <DotLottieReact
          src="/extrafiles/Taxation.lottie"
          loop
          autoplay
          className="w-full h-full drop-shadow-[0_20px_50px_rgba(11,76,128,0.15)]"
        />
      ) : (
        <Lottie
          animationData={financeAnimationData}
          loop={true}
          className="w-full h-full drop-shadow-[0_20px_50px_rgba(11,76,128,0.15)]"
        />
      )}
    </div>
  );
}
