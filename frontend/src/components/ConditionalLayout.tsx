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

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

/**
 * ConditionalLayout component that conditionally renders Header and Footer
 * based on the current route. Admin pages, login, and reset-password pages
 * will not show header/footer for a cleaner interface.
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

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
              className="flex-1 bg-blue-600 origin-top h-full"
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {showLayout && <Header />}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
=======
      {showLayout && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}
      <main className="flex-1">
        <AnimatePresence mode="wait">
>>>>>>> 78e92a6ecad02441f2b7dbd4035f473c78398474
          <PageTransition key={pathname}>{children}</PageTransition>
        </AnimatePresence>
      </main>
      {showLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}
