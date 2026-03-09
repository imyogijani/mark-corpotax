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
  Phone,
} from "lucide-react";
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

const serviceCategories = [
  {
    title: "Retail / Mortgage",
    icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
    services: [
      { name: "Home Loans", href: "/services/home-loan" },
      { name: "Loan Against Property", href: "/services/lap" },
      { name: "Commercial Loans", href: "/services/commercial-loan" },
      { name: "Industrial Loans", href: "/services/industrial-loan" },
      { name: "Balance Transfer & Top Up", href: "/services/balance-transfer" },
      { name: "Education Loan", href: "/services/education-loan" },
      { name: "Lease Rental Discounting (LRD)", href: "/services/lrd" },
    ],
  },
  {
    title: "SME / MSME Loans",
    icon: <Building2 className="w-5 h-5 text-indigo-500" />,
    services: [
      { name: "Project Finance", href: "/services/msme-project-finance" },
      { name: "Working Capital (CC/OD)", href: "/services/working-capital" },
      { name: "Letter of Credit (LC)", href: "/services/lc" },
      { name: "Bank Guarantee (BG)", href: "/services/bg" },
      { name: "Government Subsidies", href: "/services/subsidies" },
      { name: "Machinery Term Loan", href: "/services/machinery-loan" },
    ],
  },
  {
    title: "Unsecured Loans",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    services: [
      { name: "Personal Loans", href: "/services/personal-loan" },
      { name: "Business Loans", href: "/services/business-loan" },
    ],
  },
  {
    title: "Taxation Division",
    icon: <Receipt className="w-5 h-5 text-emerald-500" />,
    services: [
      { name: "Audit & Assurance", href: "/services/audit-assurance" },
      { name: "Direct & Indirect Tax", href: "/services/income-tax" },
      { name: "GST Compliance", href: "/services/gst-compliance" },
      { name: "Corporate ROC Services", href: "/services/roc" },
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
      const headerSettings = await contentService.getContentBySection("settings", "header");
      const contactSettings = await contentService.getContentBySection("settings", "contact");
      const navigationSettings: NavigationSettings = await contentService.getContentBySection("settings", "navigation");

      setSettings({ ...headerSettings, ...contactSettings });

      if (navigationSettings && Object.keys(navigationSettings).length > 0) {
        const customNavLinks: NavLink[] = [];
        for (let i = 1; i <= 5; i++) {
          const label = navigationSettings[`nav_${i}_label` as keyof NavigationSettings];
          const link = navigationSettings[`nav_${i}_link` as keyof NavigationSettings];
          if (label && link) customNavLinks.push({ href: link, label });
        }
        if (customNavLinks.length > 0) setNavLinks(customNavLinks);
      }
    } catch (error) {
      console.error("Error loading header settings:", error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    const unsubscribe = contentService.onCacheInvalidated(() => { loadSettings(); });
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", handleScroll);
    return () => { unsubscribe(); window.removeEventListener("scroll", handleScroll); };
  }, [loadSettings]);

  const companyName = settings.company_name || "Mark Corpotax";
  const companyTagline = settings.company_tagline || "Financial & Legal Solutions";
  const phoneNumber = settings.phone_display || settings.phone_finance || "97120 67891";
  const showPhone = settings.show_phone !== "false";
  const ctaText = settings.cta_text || "Choose Division";
  const ctaLink = settings.cta_link || "/services";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 md:h-24 lg:h-28 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-24 lg:mr-32 flex items-center space-x-3 group">
            <Logo className="object-contain transition-transform group-hover:scale-110" width={40} height={40} />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight">{companyName}</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{companyTagline}</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm lg:gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 font-medium ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground/80"
                } after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 ${
                  isActive(link.href) ? "after:scale-x-100" : "hover:after:scale-x-100"
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
              <span className="font-bold text-base text-white">{companyName}</span>
              <span className="text-[10px] text-slate-400 hidden sm:block uppercase tracking-wider">{companyTagline}</span>
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
            <SheetContent side="right" className="w-[320px] p-0 border-l-0 bg-white">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Logo width={32} height={32} />
                    <span className="font-bold text-lg text-slate-900">{companyName}</span>
                  </div>
                  <SheetClose className="rounded-full p-2 hover:bg-slate-100 text-slate-700">
                    <X className="w-6 h-6" />
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                            isActive(link.href)
                              ? "bg-blue-50 text-blue-600"
                              : "text-slate-800 hover:bg-slate-50 hover:text-blue-600"
                          }`}
                        >
                          <span className="font-semibold">{link.label}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                <div className="p-6 border-t border-slate-100">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-base font-bold">
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

        <div className="hidden flex-1 items-center justify-end md:flex">
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {showPhone && (
              <div className="flex items-center gap-2 group cursor-default">
                <div className="h-8 w-8 text-primary bg-primary/10 p-2 rounded-full flex items-center justify-center">
                  <motion.div whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                    <Phone size={16} />
                  </motion.div>
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs text-muted-foreground">Finance Division</p>
                  <p className="font-semibold">{phoneNumber}</p>
                </div>
              </div>
            )}
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors">
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
