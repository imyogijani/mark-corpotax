"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    const division = localStorage.getItem("user_division") || "finance";
    router.replace(`/services/${division}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Intelligence...</p>
      </div>
    </div>
  );
}

