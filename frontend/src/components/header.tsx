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
  LayoutGrid,
  Calendar,
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
  const [settings, setSettings] = useState<any>({});
  const [currentDivision, setCurrentDivision] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setCurrentDivision(localStorage.getItem("user_division"));
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("division-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("division-change", handleSync);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(false);
    }, 200);
  };

  const handleSwitchDivision = (choice: "finance" | "taxation") => {
    if (choice === currentDivision) return;
    localStorage.setItem("user_division", choice);
    setCurrentDivision(choice);
    window.dispatchEvent(new Event("division-change"));
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleGoToLanding = () => {
    localStorage.removeItem("user_division");
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    loadSettings();
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loadSettings]);

  const companyName = settings?.company_name || "Mark Corpotax";

  const filteredCategories = currentDivision === "taxation"
    ? serviceCategories.filter(cat => cat.title === "TAXATION DIVISION")
    : serviceCategories.filter(cat => cat.title !== "TAXATION DIVISION");

  return (
    <>
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled || isMobileMenuOpen
          ? "py-2.5 md:py-3"
          : "py-4 md:py-5"
          }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <nav
            className={`relative w-full flex items-center justify-between px-4 md:px-8 py-3 rounded-2xl border transition-all duration-500 bg-white/90 backdrop-blur-xl group ${currentDivision === "taxation"
              ? "border-emerald-100 shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
              : "border-blue-100 shadow-[0_20px_50px_rgba(37,99,235,0.1)]"
              } ${isScrolled ? "py-2.5 scale-[0.985]" : ""}`}
          >
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group/logo flex-shrink-0">
              <Logo
                className="object-contain transition-transform duration-500 group-hover/logo:scale-110"
                width={42}
                height={42}
              />
              <div className="flex flex-col">
                <span className={`text-sm md:text-lg font-black tracking-tighter text-slate-900 transition-colors uppercase leading-none ${currentDivision === 'taxation' ? 'group-hover/logo:text-emerald-600' : 'group-hover/logo:text-blue-600'}`}>
                  Mark Corpotax
                </span>
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] ${currentDivision === 'taxation' ? 'text-emerald-500' : 'text-blue-500'} leading-none mt-1 whitespace-nowrap`}>
                  {currentDivision === "taxation" ? "Taxation & Legal" : "Finance Division"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isServices = link.label === "Services";

                if (isServices) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={link.href}
                        className={`group/nav flex items-center gap-1.5 px-3.5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${isActive
                          ? currentDivision === 'taxation' ? "text-emerald-600" : "text-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                          }`}
                      >
                        <link.icon className="w-3.5 h-3.5" />
                        {link.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-500 ${activeMegaMenu ? "rotate-0" : ""
                            }`}
                        />
                        {isActive && (
                            <motion.div
                              layoutId="nav-underline"
                              className={`absolute bottom-[2px] left-3.5 right-3.5 h-[3px] rounded-full ${currentDivision === 'taxation' ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                      </Link>

                      {/* Invisible Bridge to prevent flicker when moving mouse to menu */}
                      {activeMegaMenu && (
                        <div className="absolute top-full left-0 w-full h-[150px] z-[60]" onMouseEnter={handleMouseEnter} />
                      )}

                      {/* Mega Menu */}
                      <AnimatePresence>
                        {activeMegaMenu && (
                          <>
                            <motion.div
                              initial={{ opacity: 0, y: 15, scale: 0.98, x: "-50%" }}
                              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                              exit={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className={`fixed top-[115px] left-1/2 w-[85vw] max-w-5xl bg-white border rounded-[2.5rem] overflow-hidden p-5 md:p-6 z-[60] ${currentDivision === "taxation"
                                ? "border-emerald-100 shadow-[0_40px_100px_rgba(16,185,129,0.15)]"
                                : "border-blue-100 shadow-[0_40px_100px_rgba(37,99,235,0.15)]"
                                }`}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredCategories.map((category, idx) => (
                                  <div key={idx} className="space-y-4 group/cat">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-[2px] ${currentDivision === 'taxation' ? 'bg-emerald-600/30' : 'bg-blue-600/30'} group-hover/cat:w-12 transition-all duration-500`} />
                                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/cat:text-slate-900 transition-colors">
                                        {category.title}
                                      </h3>
                                    </div>
                                    <div className="grid gap-1">
                                      {category.services.map((service, sIdx) => (
                                        <Link
                                          key={sIdx}
                                          href={service.href}
                                          onClick={() => setActiveMegaMenu(false)}
                                          className="group/link flex items-center justify-between p-2 rounded-[1rem] hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-all duration-500 ${currentDivision === 'taxation' ? 'group-hover/link:bg-emerald-600 group-hover/link:text-white group-hover/link:scale-110' : 'group-hover/link:bg-blue-600 group-hover/link:text-white group-hover/link:scale-110'}`}>
                                              <service.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-700 group-hover/link:text-slate-900 transition-colors">
                                              {service.name}
                                            </span>
                                          </div>
                                          <ArrowRight className={`w-4 h-4 text-slate-300 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-500 ${currentDivision === 'taxation' ? 'group-hover/link:text-emerald-500' : 'group-hover/link:text-blue-500'}`} />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}

                                {/* Promotional Panel */}
                                <div className={`relative rounded-[2rem] overflow-hidden p-6 flex flex-col justify-end min-h-[300px] group/promo ${currentDivision === 'taxation' ? 'bg-emerald-950 shadow-2xl shadow-emerald-500/20' : 'bg-blue-950 shadow-2xl shadow-blue-500/20'}`}>
                                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                                  <div className="relative z-10 space-y-4">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-black uppercase tracking-widest text-white`}>
                                      <TrendingUp className="w-3 h-3 text-white" />
                                      <span>Expert Advisory</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                      Expert <br /> Consultant.
                                    </h4>
                                    <p className="text-white/60 text-[11px] font-medium leading-relaxed">
                                      {currentDivision === "taxation"
                                        ? "Statutory audit and tax planning by certified professionals."
                                        : "Strategic capital raising and MSME project financing solutions."}
                                    </p>
                                    <Link
                                      href="/appointment"
                                      onClick={() => setActiveMegaMenu(false)}
                                      className={`w-full py-3 bg-white text-slate-900 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl`}
                                    >
                                      Schedule Call <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group/nav flex items-center gap-1.5 px-3.5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative ${isActive
                      ? currentDivision === 'taxation' ? "text-emerald-600" : "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className={`absolute bottom-[2px] left-5 right-5 h-[3px] rounded-full ${currentDivision === 'taxation' ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions Area */}
            <div className="hidden lg:flex items-center gap-2 md:gap-3 flex-shrink-0">
              {currentDivision && (
                <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 shadow-inner relative">
                  {/* Finance Choice */}
                  <button
                    onClick={() => handleSwitchDivision("finance")}
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 overflow-hidden ${currentDivision === "finance"
                      ? "text-white font-black"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    <TrendingUp className={`w-3.5 h-3.5 ${currentDivision === 'finance' ? 'animate-bounce' : ''}`} />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Finance</span>
                    {currentDivision === "finance" && (
                      <motion.div
                        layoutId="active-division"
                        className="absolute inset-0 bg-blue-600 -z-10 shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>

                  {/* Taxation Choice */}
                  <button
                    onClick={() => handleSwitchDivision("taxation")}
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 overflow-hidden ${currentDivision === "taxation"
                      ? "text-white font-black"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 ${currentDivision === 'taxation' ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Taxation</span>
                    {currentDivision === "taxation" && (
                      <motion.div
                        layoutId="active-division"
                        className="absolute inset-0 bg-emerald-600 -z-10 shadow-[0_4px_15px_rgba(16,185,129,0.4)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              )}


              <Link href="/appointment">
                <Button
                  className={`bg-slate-900 border-none text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl px-6 h-11 transition-all duration-500 flex items-center gap-2 group/btn relative overflow-hidden active:scale-95 ${currentDivision === 'taxation' ? 'hover:bg-emerald-600 shadow-xl shadow-emerald-500/10' : 'hover:bg-blue-600 shadow-xl shadow-blue-500/10'}`}
                >
                  <span className="relative z-10">Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                </Button>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-3">
              <Link href="/appointment">
                <button className={`p-3 rounded-xl transition-all active:scale-90 ${currentDivision === 'taxation' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Calendar className="w-5 h-5" />
                </button>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-3 bg-slate-900 rounded-xl text-white shadow-lg active:scale-90"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
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
              className="fixed inset-0 z-[105] bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[110] w-[320px] bg-white shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${currentDivision === 'taxation' ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                    <Logo width={28} height={28} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black uppercase tracking-tighter text-lg leading-none text-slate-900">Mark Corpotax</span>
                    <span className={`text-[8px] font-black tracking-[0.2em] mt-1 uppercase ${currentDivision === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {currentDivision === "taxation" ? "Taxation & Legal" : "Finance Division"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-900 shadow-sm active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Division Switcher */}
              <div className="px-8 pt-6">
                <div className="bg-slate-50/80 p-1.5 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleSwitchDivision("finance")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all duration-300 ${currentDivision === "finance"
                      ? "bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] scale-100 font-black"
                      : "text-slate-400 font-bold"
                      }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[11px] uppercase tracking-widest">Finance</span>
                  </button>
                  <button
                    onClick={() => handleSwitchDivision("taxation")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all duration-300 ${currentDivision === "taxation"
                      ? "bg-emerald-600 text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)] scale-100 font-black"
                      : "text-slate-400 font-bold"
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[11px] uppercase tracking-widest">Taxation</span>
                  </button>
                </div>
              </div>

              <div className="p-8 flex-1">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const LinkIcon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${isActive
                          ? currentDivision === 'taxation' ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                          : "text-slate-800 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <LinkIcon className={`w-5 h-5 ${isActive ? 'text-white' : `text-slate-400 ${currentDivision === 'taxation' ? 'group-hover:text-emerald-500' : 'group-hover:text-blue-500'}`}`} />
                          <span className="text-[13px] font-black uppercase tracking-[0.1em]">{link.label}</span>
                        </div>
                        <ArrowRight className={`w-4 h-4 opacity-50 ${isActive ? 'text-white' : ''}`} />
                      </Link>
                    );
                  })}
                </nav>


                <div className={`mt-12 p-8 ${currentDivision === 'taxation' ? 'bg-emerald-50' : 'bg-blue-50'} rounded-[40px] relative overflow-hidden group`}>
                  <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight overflow-hidden">Dedicated Support</h1>
                    <p className="text-slate-700 text-sm font-bold mb-6">Expert help is just a call away for your financial needs.</p>
                    <Link href="tel:+919712067891" className={`flex items-center gap-3 ${currentDivision === 'taxation' ? 'text-emerald-600' : 'text-blue-600'} font-extrabold group-hover:gap-5 transition-all`}>
                      <Phone className="w-5 h-5" />
                      +91 97120 67891
                    </Link>
                  </div>
                  <div className={`absolute top-[-20px] right-[-20px] w-32 h-32 ${currentDivision === 'taxation' ? 'bg-emerald-100' : 'bg-blue-100'} rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-1000`} />
                </div>
              </div>

              <div className="p-8">
                <Link href="/appointment" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className={`w-full bg-slate-900 text-white py-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 ${currentDivision === 'taxation' ? 'hover:bg-emerald-600' : 'hover:bg-blue-600'}`}>
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
