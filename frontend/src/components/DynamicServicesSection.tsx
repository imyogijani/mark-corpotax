"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Building2,
  HandCoins,
  Home,
  Award,
  FileText,
  PiggyBank,
  Shield,
  GraduationCap,
  Factory,
  Sparkles,
} from "lucide-react";

interface ServiceItem {
  slug?: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

const FALLBACK_SERVICES: ServiceItem[] = [
  { title: "MSME Machinery Loan", description: "Get financing for machinery and equipment with government subsidy benefits", icon: "Building2", slug: "msme-loan" },
  { title: "Working Capital Finance", description: "Flexible working capital solutions to manage your business operations", icon: "HandCoins", slug: "working-capital" },
  { title: "Project Finance", description: "Complete project financing solutions for your business expansion", icon: "Briefcase", slug: "project-finance" },
];

const TAXATION_FALLBACK: ServiceItem[] = [
  { title: "GST Filing & Compliance", description: "Expert GST registration, monthly returns, and audit support for businesses.", icon: "FileText", slug: "gst-compliance" },
  { title: "Income Tax Advisory", description: "Strategic tax planning and return filing for individuals and corporate entities.", icon: "Landmark", slug: "tax-advisory" },
  { title: "Company Registration", description: "End-to-end support for PVT LTD, LLP, and NGO formations and MCA filings.", icon: "Building2", slug: "company-registration" },
];

export function DynamicServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  const [division, setDivision] = useState<string>("finance");

  const fetchContent = useCallback(async () => {
    try {
      const savedDivision = localStorage.getItem("user_division");
      if (savedDivision) {
        setDivision(savedDivision);
        if (savedDivision === "taxation") setServices(TAXATION_FALLBACK);
      }

      const servicesContent = await contentService.getContentBySection("services", "services_list");
      if (servicesContent?.services_list && Array.isArray(servicesContent.services_list)) {
        setServices(servicesContent.services_list);
      }
    } catch (error) {
      console.error("Error loading services content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    window.addEventListener("storage", fetchContent);
    window.addEventListener("division-change", fetchContent);
    const unsubscribe = contentService.onCacheInvalidated(() => { fetchContent(); });
    return () => {
      window.removeEventListener("storage", fetchContent);
      window.removeEventListener("division-change", fetchContent);
      unsubscribe();
    };
  }, [fetchContent]);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      Landmark: <Landmark className="w-6 h-6 md:w-7 md:h-7" />,
      ShieldCheck: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />,
      ShieldHalf: <Shield className="w-6 h-6 md:w-7 md:h-7" />,
      Briefcase: <Briefcase className="w-6 h-6 md:w-7 md:h-7" />,
      Building2: <Building2 className="w-6 h-6 md:w-7 md:h-7" />,
      HandCoins: <HandCoins className="w-6 h-6 md:w-7 md:h-7" />,
      Home: <Home className="w-6 h-6 md:w-7 md:h-7" />,
      Award: <Award className="w-6 h-6 md:w-7 md:h-7" />,
      FileText: <FileText className="w-6 h-6 md:w-7 md:h-7" />,
      PiggyBank: <PiggyBank className="w-6 h-6 md:w-7 md:h-7" />,
      University: <GraduationCap className="w-6 h-6 md:w-7 md:h-7" />,
      Factory: <Factory className="w-6 h-6 md:w-7 md:h-7" />,
    };
    return iconMap[iconName] || <Briefcase className="w-6 h-6 md:w-7 md:h-7" />;
  };

  const displayServices = useMemo(() => services.slice(0, 3), [services]);

  return (
    <section className="py-24 md:py-36 bg-slate-50 relative overflow-hidden font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col xl:flex-row gap-16 xl:gap-20 items-start">
          {/* Left: Heading Content (Sticky) */}
          <div className="xl:w-[28%] xl:sticky xl:top-40 xl:pt-4 text-center xl:text-left flex flex-col items-center xl:items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className={`inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border shadow-sm ${division === 'taxation' ? 'border-emerald-100 text-emerald-600' : 'border-blue-100 text-blue-600'} text-[10px] font-black uppercase tracking-[0.4em] mb-8`}>
                <Sparkles className="w-4 h-4" />
                <span>{division === "taxation" ? "Regulatory Excellence" : "Strategic Wealth"}</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 text-slate-900 uppercase tracking-tighter leading-[1.1] md:leading-[1] space-y-2">
                <span className="block">{division === "taxation" ? "Statutory" : "Capital"}</span>
                <span className={division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}>
                  {division === "taxation" ? "Advisory" : "Solutions"}
                </span>
              </h2>

              <p className="text-base text-slate-500 font-medium leading-relaxed mb-10 max-w-sm">
                {division === "taxation"
                  ? "Navigating complex legal frameworks with precision audits and strategic tax planning."
                  : "Empowering your business vision with optimized capital mix and strategic project finance."}
              </p>

              <Link href="/services" className="hidden xl:inline-flex">
                <button className={`inline-flex items-center gap-5 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl active:scale-95 group ${division === 'taxation' ? 'bg-slate-900 hover:bg-emerald-600 text-white shadow-emerald-500/10' : 'bg-slate-900 hover:bg-blue-600 text-white shadow-blue-500/10'}`}>
                  View All Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Cards Grid */}
          <div className="xl:w-[72%] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              <AnimatePresence mode="wait">
                {displayServices.map((service, index) => (
                  <motion.div
                    key={`${division}-${index}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="relative group h-full flex"
                  >
                    <Link
                      href={service.slug ? `/services/${service.slug}` : (service as any).id ? `/services/${(service as any).id}` : "/services"}
                      className={`relative flex-1 flex flex-col overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 p-6 md:p-8 text-left no-underline shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(37,99,235,0.1)] ${division === 'taxation' ? 'hover:border-emerald-200 hover:shadow-emerald-500/10' : 'hover:border-blue-200 hover:shadow-blue-500/10'}`}
                    >
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight uppercase leading-[1.2] mb-4">
                              {service.title}
                            </h3>

                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            {service.description}
                          </p>
                        </div>

                        <div className={`mt-8 flex items-center text-[10px] font-black uppercase tracking-[0.3em] ${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}`}>
                          <span className="border-b-2 border-transparent pb-1">Explore</span>
                          <ArrowRight className="ml-3 h-4 w-4" />
                        </div>
                      </div>

                      {/* Premium Decorative Gradient */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="xl:hidden text-center mt-12">
              <Link href="/services">
                <button className={`inline-flex items-center gap-5 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl active:scale-95 group ${division === 'taxation' ? 'bg-slate-900 hover:bg-emerald-600 text-white shadow-emerald-500/10' : 'bg-slate-900 hover:bg-blue-600 text-white shadow-blue-500/10'}`}>
                  View All Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-50/20 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
    </section>
  );
}
