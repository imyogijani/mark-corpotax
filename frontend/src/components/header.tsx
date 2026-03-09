"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Home,
  Info,
  Briefcase,
  FileText,
  Mail,
  ShoppingBag,
  Building2,
  Zap,
  Receipt,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo-image";
import { contentService } from "@/lib/content-service";

// Types
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface ServiceItem {
  name: string;
  href: string;
  description: string;
}

interface ServiceCategory {
  title: string;
  icon: React.ElementType;
  services: ServiceItem[];
}

// Data
const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
];

const serviceCategories: ServiceCategory[] = [
  {
    title: "Retail / Mortgage",
    icon: ShoppingBag,
    services: [
      { name: "Home Loans", href: "/services/home-loan", description: "Your dream home, financed." },
      { name: "LAP", href: "/services/lap", description: "Unlock value from property." },
      { name: "Commercial Loans", href: "/services/commercial-loan", description: "Business space funding." },
    ],
  },
  {
    title: "SME / MSME Loans",
    icon: Building2,
    services: [
      { name: "Project Finance", href: "/services/msme-project-finance", description: "Large scale expansion." },
      { name: "Working Capital", href: "/services/working-capital", description: "Daily operations cashflow." },
      { name: "Subsidies", href: "/services/subsidies", description: "Govt. benefit advisory." },
    ],
  },
  {
    title: "Unsecured Loans",
    icon: Zap,
    services: [
      { name: "Personal Loans", href: "/services/personal-loan", description: "Instant personal credit." },
      { name: "Business Loans", href: "/services/business-loan", description: "Growth capital, no collateral." },
    ],
  },
  {
    title: "Taxation Division",
    icon: Receipt,
    services: [
      { name: "GST Compliance", href: "/services/gst-compliance", description: "Returns & registrations." },
      { name: "Income Tax", href: "/services/income-tax", description: "Strategic tax planning." },
      { name: "Audit Services", href: "/services/audit-assurance", description: "Assurance & compliance." },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(false);
  const [settings, setSettings] = useState<any>({});

  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Load Settings
  const loadSettings = useCallback(async () => {
    try {
      const headerSettings = await contentService.getContentBySection("settings", "header");
      setSettings(headerSettings || {});
    } catch (error) {
      console.error("Error loading header settings:", error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadSettings]);

  const companyName = settings?.company_name || "Mark Corpotax";

  return (
    <>
      {/* Mega Menu Overlay with Dot Pattern */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 px-6 py-4 ${
          isScrolled ? "pt-2" : "pt-6"
        }`}
      >
        <nav
          className={`relative w-full max-w-7xl flex items-center justify-between px-8 py-3 transition-all duration-500 shadow-2xl ${
            isScrolled
              ? "bg-white/90 backdrop-blur-xl border-white/60 rounded-[32px] py-3"
              : "bg-white/70 backdrop-blur-md border border-white/40 rounded-[28px] py-4"
          }`}
        >
          {/* Left: Logo & Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-110">
              <Logo width={36} height={36} />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                {companyName}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600/70 leading-normal mt-0.5">
                Financial Services
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <ul className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isServices = link.label === "Services";

              return (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => isServices && setActiveMegaMenu(true)}
                  onMouseLeave={() => isServices && setActiveMegaMenu(false)}
                >
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-500 text-[11px] font-black uppercase tracking-[0.15em] relative z-10 ${
                      pathname === link.href ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-transform duration-500 group-hover:scale-110 ${
                      pathname === link.href ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
                    }`} />
                    {link.label}
                    {isServices && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activeMegaMenu ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    )}

                    {/* Pill Hover Effect */}
                    <div className="absolute inset-0 bg-slate-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10 origin-center opacity-0 group-hover:opacity-100" />
                  </Link>

                  {/* Mega Menu Container */}
                  {isServices && (
                    <AnimatePresence>
                      {activeMegaMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 w-[850px]"
                        >
                          <div className="bg-white/95 backdrop-blur-2xl border border-white/60 p-10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden">
                            {/* Glow behind grid */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            
                            <div className="grid grid-cols-4 gap-8">
                              {serviceCategories.map((cat, idx) => {
                                const CatIcon = cat.icon;
                                return (
                                  <div key={idx} className="flex flex-col gap-6">
                                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <CatIcon className="w-5 h-5" />
                                      </div>
                                      <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">{cat.title}</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                      {cat.services.map((svc, sIdx) => (
                                        <Link
                                          key={sIdx}
                                          href={svc.href}
                                          className="group/svc flex flex-col gap-1 transition-all"
                                        >
                                          <span className="text-[13px] font-bold text-slate-700 group-hover/svc:text-blue-600 flex items-center gap-2">
                                            {svc.name}
                                            <ArrowRight className="w-3 h-3 opacity-0 group-hover/svc:opacity-100 -translate-x-2 group-hover/svc:translate-x-0 transition-all" />
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-medium leading-tight">{svc.description}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* bottom cta */}
                            <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-500 px-4 uppercase tracking-[0.1em]">Need personalized consultation?</span>
                              <Link href="/appointment">
                                <Button size="sm" className="bg-slate-900 hover:bg-blue-600 text-white rounded-full px-6 transition-all duration-500">
                                  Book Appointment
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right: CTA Button */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/appointment" className="group">
              <Button
                className="bg-slate-900 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-full px-8 py-6 h-auto shadow-lg hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-3 bg-white/50 backdrop-blur rounded-2xl border border-white/60 text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[320px] bg-white shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <Logo width={32} height={32} />
                  <span className="font-black italic uppercase tracking-tighter text-xl">MG</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 flex-1">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center justify-between p-5 rounded-3xl transition-all duration-300 ${
                          pathname === link.href ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <LinkIcon className={`w-5 h-5 ${pathname === link.href ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                          <span className="text-[13px] font-black uppercase tracking-[0.1em]">{link.label}</span>
                        </div>
                        <ArrowRight className={`w-4 h-4 opacity-50 ${pathname === link.href ? 'text-white' : ''}`} />
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-12 p-8 bg-blue-50 rounded-[40px] relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="text-blue-600 text-xs font-black uppercase tracking-widest mb-4">Dedicated Support</h4>
                    <p className="text-slate-700 text-sm font-bold mb-6">Expert help is just a call away for your financial needs.</p>
                    <Link href="tel:+919712067891" className="flex items-center gap-3 text-blue-600 font-extrabold group-hover:gap-5 transition-all">
                      <Phone className="w-5 h-5" />
                      +91 97120 67891
                    </Link>
                  </div>
                  <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                </div>
              </div>

              <div className="p-8">
                <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-8 rounded-[30px] font-black uppercase tracking-widest text-xs transition-all duration-500">
                  Book Appointment
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
