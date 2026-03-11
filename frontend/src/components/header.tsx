"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  RefreshCw,
  GraduationCap,
  Key,
  PieChart,
  FileEdit,
  ShieldCheck,
  TrendingUp,
  Settings,
  User,
  ClipboardCheck,
  Calculator,
  Gavel,
  Factory,
  Search,
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
  icon: React.ElementType;
}

interface ServiceCategory {
  title: string;
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
    title: "Retail & Mortgage",
    services: [
      { name: "Home Loans", href: "/services/home-loan", icon: Home },
      { name: "Loan Against Property", href: "/services/lap", icon: Building2 },
      { name: "Commercial Loans", href: "/services/commercial-loan", icon: ShoppingBag },
      { name: "Industrial Loans", href: "/services/industrial-loan", icon: Factory },
      { name: "Balance Transfer & Top Up", href: "/services/balance-transfer", icon: RefreshCw },
      { name: "Education Loan", href: "/services/education-loan", icon: GraduationCap },
      { name: "Lease Rental Discounting (LRD)", href: "/services/lrd", icon: Key },
    ],
  },
  {
    title: "SME/MSME LOANS",
    services: [
      { name: "Project Finance", href: "/services/msme-project-finance", icon: PieChart },
      { name: "Working Capital (CC/OD)", href: "/services/working-capital", icon: Zap },
      { name: "Letter of Credit (LC)", href: "/services/lc", icon: FileEdit },
      { name: "Bank Guarantee (BG)", href: "/services/bg", icon: ShieldCheck },
      { name: "Government Subsidies", href: "/services/subsidies", icon: TrendingUp },
      { name: "Machinery Term Loan", href: "/services/machinery-loan", icon: Settings },
    ],
  },
  {
    title: "UNSECURED LOANS",
    services: [
      { name: "Personal Loans", href: "/services/personal-loan", icon: User },
      { name: "Business Loans", href: "/services/business-loan", icon: Briefcase },
    ],
  },
  {
    title: "TAXATION DIVISION",
    services: [
      { name: "Audit & Assurance", href: "/services/audit-assurance", icon: ClipboardCheck },
      { name: "Direct & Indirect Tax", href: "/services/income-tax", icon: Calculator },
      { name: "GST Compliance", href: "/services/gst-compliance", icon: FileText },
      { name: "Corporate ROC Services", href: "/services/roc", icon: Gavel },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [settings, setSettings] = useState<any>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMegaMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(true);
  };

  const closeMegaMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(false);
    }, 200);
  };

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
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loadSettings]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sync searchQuery with URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== searchQuery) {
      setSearchQuery(q || "");
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (pathname === "/services") {
      router.replace(`/services?q=${encodeURIComponent(val)}`, { scroll: false });
    }
  };

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
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-500 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >

        <nav
          className={`relative w-full max-w-[95%] lg:max-w-7xl flex items-center justify-between px-8 py-2 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.1)] gpu ${
            isScrolled
              ? "bg-white/95 backdrop-blur-xl border border-white/60 rounded-full py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              : "bg-white/90 backdrop-blur-md border border-white/20 rounded-full py-3 lg:py-5"
          }`}
        >
          {/* Left: Logo & Brand */}
          <Link href="/" className="group flex items-center gap-2 md:gap-3">
            <div className="relative overflow-hidden rounded-lg md:rounded-xl transition-transform duration-500 group-hover:scale-110">
              <Logo width={32} height={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] md:text-[18px] font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                {companyName}
              </span>
              <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.3em] text-blue-600/70 leading-normal mt-0.5 md:mt-1">
                SURAT REGIONAL HQ
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
                  onMouseEnter={() => isServices && openMegaMenu()}
                  onMouseLeave={() => isServices && closeMegaMenu()}
                >
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-2.5 px-6 py-2.5 rounded-full transition-all duration-500 text-[12px] font-black uppercase tracking-[0.2em] relative z-20 ${
                      pathname === link.href || (isServices && activeMegaMenu) 
                        ? "text-blue-600 bg-white shadow-[0_4px_20px_rgba(37,99,235,0.15)] border border-blue-50" 
                        : "text-slate-900/80 hover:text-blue-600 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-all duration-500 ${
                      pathname === link.href || (isServices && activeMegaMenu) ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                    }`} />
                    {link.label}
                    {isServices && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-all duration-500 ${activeMegaMenu ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                    )}

                    <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10 origin-center opacity-0 group-hover:opacity-100 blur-sm" />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mega Menu Container - Moved outside the loop for centered alignment relative to nav */}
          <AnimatePresence>
            {activeMegaMenu && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                onMouseEnter={openMegaMenu}
                onMouseLeave={closeMegaMenu}
                className="absolute left-[38%] -translate-x-1/2 -ml-[200px] top-full pt-3 z-50 w-[calc(100vw-64px)] max-w-4xl"
              >
                <div className="bg-white border border-slate-200 p-0 rounded-[28px] shadow-[0_25px_50px_rgba(0,0,0,0.1)] relative group/menu overflow-hidden">
                  <div className="absolute -top-8 left-0 right-0 h-8 bg-transparent" />
                  
                  <div className="p-5 relative max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
                    <div className="grid grid-cols-4 gap-4 relative z-10">
                      {serviceCategories.map((cat, idx) => {
                        const isTaxation = idx === 3;
                        
                        return (
                          <div key={idx} className={`flex flex-col gap-4 ${isTaxation ? 'bg-emerald-50/30 p-4 rounded-[22px] border border-emerald-100/50' : idx < 3 ? 'border-r border-slate-100/60 pr-2' : ''}`}>
                            <div className="flex flex-col gap-1 px-1">
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isTaxation ? 'text-emerald-700' : 'text-blue-600'}`}>
                                {cat.title}
                              </span>
                              <div className={`h-[1px] w-6 ${isTaxation ? 'bg-emerald-200' : 'bg-blue-200'}`} />
                            </div>
                            
                            <div className="flex flex-col gap-0.5">
                              {cat.services.map((svc, sIdx) => {
                                const SvcIcon = svc.icon;
                                return (
                                  <Link
                                    key={sIdx}
                                    href={svc.href}
                                    onClick={() => setActiveMegaMenu(false)}
                                    className="group/svc flex items-center gap-3 p-1.5 rounded-lg transition-all duration-300 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                  >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${isTaxation ? 'bg-white shadow-sm text-emerald-600 group-hover/svc:bg-emerald-600 group-hover/svc:text-white' : 'bg-blue-50 text-blue-600 group-hover/svc:bg-blue-600 group-hover/svc:text-white'}`}>
                                      <SvcIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-700 group-hover/svc:text-blue-600 transition-colors leading-tight">
                                      {svc.name}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* bottom cta bar */}
                  <div className="bg-slate-50/80 backdrop-blur-md px-12 py-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shaping successful corporate landscapes since 2012</span>
                    </div>
                    <Link href="/services">
                      <Button className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-8 py-2.5 h-auto text-[11px] font-black uppercase tracking-[0.15em] shadow-sm flex items-center gap-3 transition-all">
                        Explore All Services
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Search & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Bar Implementation */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onSubmit={handleSearch}
                    className="relative mr-2 overflow-hidden gpu"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-12 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                    <button 
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-3 rounded-full transition-all duration-300 ${isSearchOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                title="Search Services"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            <div className="w-[1px] h-6 bg-slate-100 mx-2" />

            <Link href="/appointment" className="group">
              <Button
                className="bg-slate-900 hover:bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-full px-10 py-6 h-auto shadow-lg hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-3 rounded-2xl border transition-all duration-300 ${isSearchOpen ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white/50 backdrop-blur border-white/60 text-slate-900'}`}
            >
              {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-white/50 backdrop-blur rounded-2xl border border-white/60 text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Search Bar Expandable - Full Width */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden w-full max-w-[95%] mt-2 overflow-hidden"
            >
              <form 
                onSubmit={handleSearch}
                className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-[2rem] p-2 flex items-center shadow-xl"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="flex-1 bg-transparent px-6 py-3 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  className="bg-slate-900 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
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
              <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Logo width={28} height={28} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black italic uppercase tracking-tighter text-lg leading-none">Mark Legacy</span>
                    <span className="text-[6px] font-black text-blue-600 tracking-widest mt-1 uppercase">Surat Regional HQ</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-900 shadow-sm active:scale-90"
                >
                  <X className="w-5 h-5" />
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
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight overflow-hidden">Dedicated Support</h1>
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
