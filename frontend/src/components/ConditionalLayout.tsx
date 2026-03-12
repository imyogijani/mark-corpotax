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
      <Preloader />
      <ScrollProgress />
<<<<<<< HEAD
=======
      {/* Premium Navigation Curtain */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`curtain-${pathname}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] pointer-events-none flex"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: [0, 1, 0],
                transition: {
                  duration: 1.2,
                  times: [0, 0.5, 1],
                  delay: i * 0.1,
                  ease: "easeInOut"
                }
              }}
              className="flex-1 origin-top h-full"
              style={{ backgroundColor: currentDivision === 'taxation' ? '#059669' : '#2563eb' }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
>>>>>>> b5f05c8449eb89f0eee28a0a3cb365b6e7bcb258

      {showLayout && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}
<<<<<<< HEAD
      <main className="flex-1 overflow-hidden">
        {children}
=======
      <main className="flex-1 overflow-x-hidden relative">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={`${pathname}-${currentDivision}`}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
                opacity: 0,
                filter: "blur(10px)"
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1,
                filter: "blur(0px)"
              },
              exit: (dir: number) => ({
                zIndex: 0,
                x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
                opacity: 0,
                filter: "blur(10px)"
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              filter: { duration: 0.3 }
            }}
            className="w-full h-full"
          >
            <PageTransition key={pathname}>{children}</PageTransition>
          </motion.div>
        </AnimatePresence>
>>>>>>> b5f05c8449eb89f0eee28a0a3cb365b6e7bcb258
      </main>
      {showLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}
