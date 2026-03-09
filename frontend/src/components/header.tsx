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
import { ChangeDivisionButton } from "./ChangeDivisionButton";

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
        "header",
      );
      const contactSettings = await contentService.getContentBySection(
        "settings",
        "contact",
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="container flex h-20 md:h-24 lg:h-28 max-w-screen-2xl items-center px-6">
        <div className="mr-4 hidden md:flex items-center">
          <Link
            href="/"
            className="mr-16 lg:mr-24 flex items-center space-x-4 group"
          >
            <Logo
              className="object-contain transition-transform group-hover:scale-110"
              width={48}
              height={48}
            />
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 tracking-tight leading-tight uppercase">
                {companyName}
              </span>
              <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">
                {companyTagline}
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 ${isActive(link.href)
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-900"
                  } after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 ${isActive(link.href)
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
          <Link href="/" className="flex items-center space-x-3">
            <Logo className="object-contain" width={32} height={32} />
            <div className="flex flex-col">
              <span className="font-black text-sm text-slate-900 uppercase tracking-tight">
                {companyName}
              </span>
              <span className="text-[8px] text-blue-600 font-bold uppercase tracking-wider">
                {companyTagline}
              </span>
            </div>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 border border-slate-100">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Menu className="h-5 w-5 text-slate-900" />
                </motion.div>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white border-l border-slate-100">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col p-6">
                <div className="mb-10 flex flex-col items-center border-b border-slate-50 pb-8 space-y-4">
                  <Logo className="object-contain" width={80} height={80} />
                  <div className="text-center">
                    <span className="font-black text-xl text-slate-900 block uppercase tracking-tight">
                      {companyName}
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em]">
                      {companyTagline}
                    </span>
                  </div>
                  {pathname === "/" && <ChangeDivisionButton shouldAnimate={false} className="mt-4 w-full" />}
                </div>
                <nav className="flex flex-1 flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`rounded-2xl p-4 text-sm font-black uppercase tracking-widest transition-all ${isActive(link.href)
                          ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                          : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
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
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95"
                    >
                      <Link
                        href="/appointment"
                        className="flex items-center justify-center gap-3"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            repeatDelay: 3,
                          }}
                        >
                          <BookUser size={18} />
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
          <div className="flex items-center gap-6 lg:gap-8">
            {pathname === "/" && <ChangeDivisionButton shouldAnimate={false} className="hidden xl:block" />}
            {showPhone && (
              <div className="flex items-center gap-4 group cursor-default">
                <div className="h-10 w-10 text-blue-600 bg-blue-50 border border-blue-100 p-2 rounded-xl flex items-center justify-center shadow-sm">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Phone size={18} />
                  </motion.div>
                </div>
                <div className="hidden 2xl:block">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-tight">
                    Support
                  </p>
                  <p className="font-black text-slate-900 tracking-tight">{phoneNumber}</p>
                </div>
              </div>
            )}
            <Button
              asChild
              size="lg"
              className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
