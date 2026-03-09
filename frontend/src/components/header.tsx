"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  ArrowRight, 
  ChevronDown, 
  ShoppingBag, 
  Building2, 
  Zap, 
  Receipt,
  X,
  Phone
} from "lucide-react";
import { Logo } from "./logo-image";
import { contentService } from "@/lib/content-service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

const serviceCategories = [
  {
    title: "Retail / Mortgage",
    icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
    services: [
      { name: "Home Loan", href: "/services/home-loan" },
      { name: "LAP / Mortgage", href: "/services/mortgage" },
      { name: "Personal Loan", href: "/services/personal-loan" },
      { name: "Car / Vehicle Loan", href: "/services/car-loan" },
    ],
  },
  {
    title: "SME / MSME",
    icon: <Building2 className="w-5 h-5 text-indigo-500" />,
    services: [
      { name: "Business Loan", href: "/services/business-loan" },
      { name: "Working Capital", href: "/services/working-capital" },
      { name: "Machinery Loan", href: "/services/machinery-loan" },
      { name: "Project Finance", href: "/services/project-finance" },
    ],
  },
  {
    title: "Unsecured / Limit",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    services: [
      { name: "Overdraft (OD)", href: "/services/overdraft" },
      { name: "Cash Credit (CC)", href: "/services/cash-credit" },
      { name: "Dropline OD", href: "/services/dropline-od" },
      { name: "PMEGP / CMEGP", href: "/services/government-loan" },
    ],
  },
  {
    title: "Taxation / Legal",
    icon: <Receipt className="w-5 h-5 text-emerald-500" />,
    services: [
      { name: "GST Registration", href: "/taxation/gst" },
      { name: "Income Tax Audit", href: "/taxation/income-tax" },
      { name: "Private Limited Inc.", href: "/taxation/incorporation" },
      { name: "Trademark / ISO", href: "/taxation/legal" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<HeaderSettings>({});
  const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const megaMenuRef = useRef<HTMLDivElement>(null);

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
    const unsubscribe = contentService.onCacheInvalidated(() => {
      loadSettings();
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadSettings]);

  const companyName = settings.company_name || "Mark Corpotax";
  const companyTagline = settings.company_tagline || "Financial & Legal Solutions";
  const phoneNumber = settings.phone_display || settings.phone_finance || "97120 67891";
  const showPhone = settings.show_phone !== "false";
  const ctaText = settings.cta_text || "Inquiry";
  const ctaLink = settings.cta_link || "/appointment";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Background Overlay when Mega Menu is open */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300"
            onClick={() => setIsMegaMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8",
          isScrolled ? "pt-4" : "pt-6"
        )}
      >
        <div 
          className={cn(
            "mx-auto max-w-7xl transition-all duration-500",
            "bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            "rounded-full px-6 py-3 flex items-center justify-between"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <Logo 
              className="object-contain transition-transform duration-300 group-hover:scale-110" 
              width={38} 
              height={38} 
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg dark:text-white text-slate-900 tracking-tight">
                {companyName.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                {companyTagline.split(' ')[0]}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isServices = link.label.toLowerCase() === "services";
              return (
                <div
                  key={link.href}
                  className="relative flex items-center h-full group"
                  onMouseEnter={() => isServices && setIsMegaMenuOpen(true)}
                  onMouseLeave={() => {}}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1",
                      isActive(link.href) 
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {link.label}
                    {isServices && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isMegaMenuOpen ? "rotate-180" : ""
                      )} />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Action Button & Phone */}
          <div className="flex items-center gap-3">
            {showPhone && (
              <div className="hidden xl:flex items-center gap-2 mr-2">
                <div className="h-8 w-8 text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full flex items-center justify-center">
                  <Phone size={14} />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{phoneNumber}</span>
              </div>
            )}
            
            <Button 
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-full px-5 py-2 hidden sm:flex items-center gap-2 group transition-all duration-300"
            >
              <Link href={ctaLink}>
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Mobile Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0 border-l-0 bg-white dark:bg-slate-950">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Logo width={32} height={32} />
                      <span className="font-bold text-lg">{companyName}</span>
                    </div>
                    <SheetClose className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                      <X className="w-6 h-6" />
                    </SheetClose>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl transition-all",
                              isActive(link.href)
                                ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}
                          >
                            <span className="font-semibold">{link.label}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6 border-t dark:border-slate-800">
                    <Button asChild className="w-full bg-slate-900 dark:bg-white py-6 rounded-2xl text-lg">
                      <Link href={ctaLink} className="flex items-center justify-center gap-2">
                        <span>{ctaText}</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              className="absolute left-0 right-0 top-[calc(100%+10px)] mx-auto max-w-7xl z-50 pointer-events-auto"
            >
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="grid grid-cols-4 p-8 gap-8">
                  {serviceCategories.map((category, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700">
                          {category.icon}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">
                          {category.title}
                        </h3>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {category.services.map((service, sIdx) => (
                          <Link
                            key={sIdx}
                            href={service.href}
                            className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                          >
                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-blue-600 font-medium">
                              {service.name}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-between border-t dark:border-slate-800">
                  <div className="flex items-center gap-6">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Need expert consultation?</p>
                    <div className="flex gap-4">
                      <Link href="/faq" className="text-xs font-bold text-blue-600 hover:underline">Help Center</Link>
                      <Link href="/blog" className="text-xs font-bold text-blue-600 hover:underline">Latest Updates</Link>
                    </div>
                  </div>
                  <Link 
                    href="/services" 
                    className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white hover:gap-3 transition-all"
                  >
                    View All Services <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
