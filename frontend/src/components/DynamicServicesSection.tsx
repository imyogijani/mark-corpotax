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
    const unsubscribe = contentService.onCacheInvalidated(() => { fetchContent(); });
    return () => { unsubscribe(); };
  }, [fetchContent]);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      Landmark: <Landmark className="w-10 h-10 md:w-12 md:h-12" />,
      ShieldCheck: <ShieldCheck className="w-10 h-10 md:w-12 md:h-12" />,
      ShieldHalf: <Shield className="w-10 h-10 md:w-12 md:h-12" />,
      Briefcase: <Briefcase className="w-10 h-10 md:w-12 md:h-12" />,
      Building2: <Building2 className="w-10 h-10 md:w-12 md:h-12" />,
      HandCoins: <HandCoins className="w-10 h-10 md:w-12 md:h-12" />,
      Home: <Home className="w-10 h-10 md:w-12 md:h-12" />,
      Award: <Award className="w-10 h-10 md:w-12 md:h-12" />,
      FileText: <FileText className="w-10 h-10 md:w-12 md:h-12" />,
      PiggyBank: <PiggyBank className="w-10 h-10 md:w-12 md:h-12" />,
      University: <GraduationCap className="w-10 h-10 md:w-12 md:h-12" />,
      Factory: <Factory className="w-10 h-10 md:w-12 md:h-12" />,
    };
    return iconMap[iconName] || <Briefcase className="w-10 h-10 md:w-12 md:h-12" />;
  };

  const displayServices = useMemo(() => services.slice(0, 3), [services]);

  return (
    <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden font-sans">
      <div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <div className="relative text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-blue-100 shadow-sm text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <Sparkles className="w-4 h-4" />
              <span>What We Offer</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tighter leading-none">
              {division === "taxation" ? "Expert Advisory" : "Financial Solutions"} <br />
              <span className="text-blue-600">Tailored For You</span>
            </h2>

            <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              From growth capital to strategic taxation, our multi-division experts provide the precision your financial future demands.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode="wait">
            {displayServices.map((service, index) => (
              <motion.div 
                key={`${division}-${index}`} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={service.slug ? `/services/${service.slug}` : (service as any).id ? `/services/${(service as any).id}` : "/services"}
                  className="relative block h-full w-full overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 p-8 md:p-12 text-left no-underline shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(37,99,235,0.12)] hover:border-blue-200 transition-all duration-500"
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex-1">
                      <div className="mb-8 md:mb-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 shadow-inner group-hover:rotate-6">
                        <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                          {getIcon(service.icon || "")}
                        </div>
                      </div>

                      <h3 className="mb-4 text-xl md:text-2xl font-black text-slate-900 transition-colors group-hover:text-blue-600 tracking-tight uppercase leading-[1.1]">
                        {service.title}
                      </h3>

                      <p className="text-xs md:text-sm text-slate-500 group-hover:text-slate-600 leading-relaxed font-medium">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-10 md:mt-12 flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 group-hover:text-blue-700 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-3 transition-transform" />
                    </div>
                  </div>

                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-24"
        >
          <Link href="/services">
            <button className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-200 hover:shadow-blue-500/20 active:scale-95 group">
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-50/20 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
    </section>
  );
}
