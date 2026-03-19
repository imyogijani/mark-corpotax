"use client";

import { usePathname } from "next/navigation";
import { useMemo, Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

/**
 * ConditionalLayout component that conditionally renders Header and Footer
 * based on the current route. Admin pages, login, and reset-password pages
 * will not show header/footer for a cleaner interface.
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const [currentDivision, setCurrentDivision] = useState<string>("finance");
  const [direction, setDirection] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleSync = () => {
      const newDiv = localStorage.getItem("user_division") || "finance";
      if (newDiv !== currentDivision) {
        setDirection(newDiv === "taxation" ? 1 : -1);
        setCurrentDivision(newDiv);
      }
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("division-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("division-change", handleSync);
    };
  }, [currentDivision]);

  // Use useMemo for synchronous calculation - no flash/blink
  const showLayout = useMemo(() => {
    // Routes that should not show header and footer
    const hideHeaderFooterRoutes = ["/login", "/reset-password", "/register"];

    // Check if current path should hide header/footer
    const shouldHide =
      hideHeaderFooterRoutes.includes(pathname) ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard");

    return !shouldHide;
  }, [pathname]);

  return (
    <>
      <SmoothScroll />
      <Preloader division={currentDivision} />
      <ScrollProgress division={currentDivision} />



      {showLayout && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}
      <main className="flex-1 overflow-x-hidden relative bg-slate-50 min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      {showLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}
