"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";

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
      {showLayout && <Header />}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      {showLayout && <Footer />}
    </>
  );
}
