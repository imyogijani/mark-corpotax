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
  LayoutGrid,
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

  const handleSwitchDivision = (choice: "finance" | "taxation") => {
    if (choice === currentDivision) return;
    localStorage.setItem("user_division", choice);
    window.location.reload();
  };

  const handleGoToLanding = () => {
    localStorage.removeItem("user_division");
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
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
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isSearchOpen || isMobileMenuOpen || activeMegaMenu
            ? "py-3 md:py-4"
            : "py-6 md:py-8"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-center">
          <nav
            className={`relative w-full max-w-7xl flex items-center justify-between px-4 md:px-8 py-3 rounded-full border border-white/40 transition-all duration-500 shadow-2xl backdrop-blur-3xl bg-white/70 group ${
              isScrolled || activeMegaMenu ? "shadow-blue-500/10" : "shadow-transparent"
            }`}
          >
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group/logo flex-shrink-0">
              <Logo
                className="object-contain transition-transform duration-500 group-hover/logo:scale-110"
                width={42}
                height={42}
              />
              <div className="flex flex-col">
                <span className="text-sm md:text-lg font-black tracking-tighter text-slate-900 group-hover/logo:text-blue-600 transition-colors uppercase leading-none">
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
                      onMouseEnter={() => setActiveMegaMenu(true)}
                      onMouseLeave={() => setActiveMegaMenu(false)}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                          isActive || activeMegaMenu
                            ? currentDivision === 'taxation' ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <link.icon className="w-3.5 h-3.5" />
                        {link.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-500 ${
                            activeMegaMenu ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      {/* Mega Menu */}
                      <AnimatePresence>
                        {activeMegaMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                            exit={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed top-[100px] left-1/2 w-[90vw] max-w-6xl bg-white/95 backdrop-blur-3xl border border-slate-100 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden p-5 md:p-7 z-[60]"
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
                                        className="group/link flex items-center justify-between p-2 md:p-2.5 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-all duration-500 ${currentDivision === 'taxation' ? 'group-hover/link:bg-emerald-600 group-hover/link:text-white group-hover/link:scale-110 shadow-emerald-500/10' : 'group-hover/link:bg-blue-600 group-hover/link:text-white group-hover/link:scale-110 shadow-blue-500/10'}`}>
                                            <service.icon className="w-4 h-4" />
                                          </div>
                                          <span className="text-xs font-bold text-slate-700 group-hover/link:text-slate-900 transition-colors">
                                            {service.name}
                                          </span>
                                        </div>
                                        <ArrowRight className={`w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-500 ${currentDivision === 'taxation' ? 'group-hover/link:text-emerald-500' : 'group-hover/link:text-blue-500'}`} />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              {/* Promotional Panel */}
                              <div className={`relative rounded-[2rem] overflow-hidden p-6 md:p-8 flex flex-col justify-end min-h-[320px] group/promo ${currentDivision === 'taxation' ? 'bg-emerald-900' : 'bg-blue-900'}`}>
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                                <div className="relative z-10 space-y-4">
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[7px] font-black uppercase tracking-widest text-white`}>
                                    <TrendingUp className="w-2.5 h-2.5 text-white" />
                                    <span>Expert Advisory</span>
                                  </div>
                                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                    Expert <br /> Consultant.
                                  </h4>
                                  <p className="text-white/60 text-[10px] font-medium leading-relaxed">
                                    {currentDivision === "taxation"
                                      ? "Statutory audit and tax planning by certified professionals."
                                      : "Strategic capital raising and MSME project financing solutions."}
                                  </p>
                                  <Link
                                    href="/appointment"
                                    onClick={() => setActiveMegaMenu(false)}
                                    className={`w-full py-3 bg-white text-slate-900 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all ${currentDivision === 'taxation' ? 'shadow-xl shadow-emerald-950/20' : 'shadow-xl shadow-blue-950/20'}`}
                                  >
                                    Schedule Call <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? currentDivision === 'taxation' ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100/50"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions Area */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {currentDivision && (
                <div className="flex items-center gap-1 bg-slate-50/50 p-1 rounded-full border border-slate-100 shadow-inner">
                  <button
                    onClick={() => handleSwitchDivision("finance")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${currentDivision === "finance"
                        ? "bg-white text-blue-600 shadow-sm font-black"
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[8px] uppercase tracking-wider">Finance</span>
                  </button>
                  <button
                    onClick={() => handleSwitchDivision("taxation")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${currentDivision === "taxation"
                        ? "bg-white text-emerald-600 shadow-sm font-black"
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[8px] uppercase tracking-wider">Taxation</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSearchOpen 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>

              <Link href="/appointment">
                <Button
                  className="bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-full px-6 py-2 h-10 shadow-none transition-all duration-500 flex items-center gap-2"
                >
                  Join
                  <ArrowRight className="w-3 h-3" />
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
        </div>

        {/* Desktop Dropdown Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: "auto", opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block w-full max-w-2xl mt-4 overflow-hidden z-[49]"
            >
              <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-b-blue-500/10">
                <form 
                  onSubmit={handleSearch}
                  className="flex items-center gap-3 px-4 py-1"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="What legal or financial service are you looking for?"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-1 bg-transparent py-4 text-[16px] font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                  <Button 
                    type="submit"
                    className="bg-slate-900 hover:bg-blue-600 text-white rounded-full px-8 h-12 text-[12px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Bar Expandable */}
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

              {/* Mobile Division Switcher */}
              <div className="px-8 pt-6">
                <div className="bg-slate-50/80 p-1.5 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleSwitchDivision("finance")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all duration-300 ${currentDivision === "finance"
                        ? "bg-white text-blue-600 shadow-lg shadow-blue-500/10 scale-100"
                        : "text-slate-400"
                      }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Finance</span>
                  </button>
                  <button
                    onClick={() => handleSwitchDivision("taxation")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all duration-300 ${currentDivision === "taxation"
                        ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 scale-100"
                        : "text-slate-400"
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Taxation</span>
                  </button>
                </div>
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
                        className={`group flex items-center justify-between p-5 rounded-3xl transition-all duration-300 ${pathname === link.href ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "text-slate-800 hover:bg-slate-50"
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
                <Link href="/appointment" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-8 rounded-[30px] font-black uppercase tracking-widest text-xs transition-all duration-500">
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
