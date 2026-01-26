"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, BookUser, Phone } from "lucide-react";
import { Logo } from "./logo-image";
import { contentService } from "@/lib/content-service";
import { motion } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
}

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface HeaderSettings {
  company_name?: string;
  company_tagline?: string;
  phone_finance?: string;
  phone_taxation?: string;
  show_phone?: string;
  phone_display?: string;
  cta_text?: string;
  cta_link?: string;
}

interface NavigationSettings {
  nav_1_label?: string;
  nav_1_link?: string;
  nav_2_label?: string;
  nav_2_link?: string;
  nav_3_label?: string;
  nav_3_link?: string;
  nav_4_label?: string;
  nav_4_link?: string;
  nav_5_label?: string;
  nav_5_link?: string;
}

export function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<HeaderSettings>({});
  const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);

  const loadSettings = useCallback(async () => {
    try {
      const headerSettings = await contentService.getContentBySection(
        "settings",
        "header"
      );
      const contactSettings = await contentService.getContentBySection(
        "settings",
        "contact"
      );
      const navigationSettings: NavigationSettings =
        await contentService.getContentBySection("settings", "navigation");

      setSettings({ ...headerSettings, ...contactSettings });

      // Build navigation from settings if available
      if (navigationSettings && Object.keys(navigationSettings).length > 0) {
        const customNavLinks: NavLink[] = [];
        for (let i = 1; i <= 5; i++) {
          const label =
            navigationSettings[`nav_${i}_label` as keyof NavigationSettings];
          const link =
            navigationSettings[`nav_${i}_link` as keyof NavigationSettings];
          if (label && link) {
            customNavLinks.push({ href: link, label });
          }
        }
        if (customNavLinks.length > 0) {
          setNavLinks(customNavLinks);
        }
      }
    } catch (error) {
      console.error("Error loading header settings:", error);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    // Subscribe to cache invalidation events to refresh when content is updated
    const unsubscribe = contentService.onCacheInvalidated(() => {
      loadSettings();
    });

    return () => {
      unsubscribe();
    };
  }, [loadSettings]);

  const companyName = settings.company_name || "Mark Corpotax";
  const companyTagline =
    settings.company_tagline || "Financial & Legal Solutions";
  const phoneNumber =
    settings.phone_display || settings.phone_finance || "97120 67891";
  const showPhone = settings.show_phone !== "false";
  const ctaText = settings.cta_text || "Get a Quote";
  const ctaLink = settings.cta_link || "/appointment";

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 md:h-24 lg:h-28 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-48 flex items-center space-x-3">
            <Logo className="object-contain" width={40} height={40} />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800">
                {companyName}
              </span>
              <span className="text-sm text-gray-600">{companyTagline}</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm lg:gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 font-medium ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground/80"
                } after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 ${
                  isActive(link.href)
                    ? "after:scale-x-100"
                    : "hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="object-contain" width={32} height={32} />
            <div className="flex flex-col">
              <span className="font-bold text-base text-gray-800">
                {companyName}
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                {companyTagline}
              </span>
            </div>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Menu className="h-6 w-6" />
                </motion.div>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex flex-col items-center border-b pb-4 space-y-3">
                  <Logo className="object-contain" width={80} height={80} />
                  <div className="text-center">
                    <span className="font-bold text-lg text-gray-800 block">
                      {companyName}
                    </span>
                    <span className="text-sm text-gray-600">
                      {companyTagline}
                    </span>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col gap-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`rounded-lg p-2 text-lg transition-colors ${
                          isActive(link.href)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto">
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors"
                    >
                      <Link href="/appointment" className="flex items-center justify-center">
                        <motion.div 
                          className="mr-2"
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                        >
                          <BookUser size={16} />
                        </motion.div>
                        Book Appointment
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden flex-1 items-center justify-end md:flex">
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {showPhone && (
              <div className="flex items-center gap-2 group cursor-default">
                <div className="h-8 w-8 text-primary bg-primary/10 p-2 rounded-full flex items-center justify-center">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Phone size={16} />
                  </motion.div>
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs text-muted-foreground">
                    Finance Division
                  </p>
                  <p className="font-semibold">{phoneNumber}</p>
                </div>
              </div>
            )}
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
