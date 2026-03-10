"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
} from "lucide-react";
import { StaggerContainer, StaggerItem, MotionWrapper } from "@/components/MotionWrapper";
import { motion } from "framer-motion";
import ScrollWatermark from "@/components/ScrollWatermark";
import Magnetic from "@/components/Magnetic";

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
    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => { fetchContent(); });
    return () => { unsubscribe(); };
  }, [fetchContent]);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      Landmark: <Landmark className="w-12 h-12" />,
      ShieldCheck: <ShieldCheck className="w-12 h-12" />,
      ShieldHalf: <Shield className="w-12 h-12" />,
      Briefcase: <Briefcase className="w-12 h-12" />,
      Building2: <Building2 className="w-12 h-12" />,
      HandCoins: <HandCoins className="w-12 h-12" />,
      Home: <Home className="w-12 h-12" />,
      Award: <Award className="w-12 h-12" />,
      FileText: <FileText className="w-12 h-12" />,
      PiggyBank: <PiggyBank className="w-12 h-12" />,
      University: <GraduationCap className="w-12 h-12" />,
      Factory: <Factory className="w-12 h-12" />,
    };
    const iconElement = iconMap[iconName] || <Briefcase className="w-12 h-12" />;
    return (
      <motion.div whileHover={{ rotateY: 180, scale: 1.1 }} transition={{ duration: 0.6 }} className="origin-center">
        {iconElement}
      </motion.div>
    );
  };

  const displayServices = useMemo(() => services.slice(0, 3), [services]);

  return (
    <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
      <ScrollWatermark text="SOLUTIONS" className="top-20 left-10 opacity-70 text-slate-200" />

      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          <ScrollWatermark text="SERVICES" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 text-slate-200 uppercase" />

          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">What We Offer</span>
              <span className="w-8 h-[2px] bg-blue-600" />
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {division === "taxation" ? "Expert Advisory" : "Financial Solutions"}
            </motion.h2>

            <motion.p
              className="text-lg text-slate-600 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              Tailored strategies to boost your business growth and stability.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" viewport={{ once: false, amount: 0.1 }}>
          {displayServices.map((service, index) => (
            <div key={index} className="relative group">
              <Link
                href={service.slug ? `/services/${service.slug}` : "/services"}
                className="relative block h-full w-full overflow-hidden rounded-[3rem] bg-white border border-slate-100 p-10 text-left no-underline transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(37,99,235,0.12)] hover:-translate-y-4 hover:border-blue-200 group"
              >
                {/* Refined Background Pulse */}
                <div
                  className="absolute -right-16 -top-16 -z-0 h-64 w-64 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[10] opacity-0 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle at center, #eff6ff 0%, #dbeafe 100%)" }}
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex-1">
                    <motion.div className="mb-10 w-20 h-20 rounded-[2rem] bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center transition-all duration-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:rotate-[360deg] shadow-inner relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                       <div className="relative z-10 scale-75 group-hover:scale-100 transition-transform duration-700">
                          {getIcon(service.icon || "")}
                       </div>
                    </motion.div>

                    <h3 className="mb-4 text-2xl font-black text-slate-900 transition-colors duration-500 group-hover:text-blue-600 tracking-tight uppercase leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-[15px] text-slate-600 transition-colors duration-500 group-hover:text-slate-700 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 group-hover:text-blue-700 transition-all duration-500">
                    <span className="relative overflow-hidden inline-block h-4">
                      <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">Explore Solutions</span>
                      <span className="absolute top-full left-0 inline-block transition-transform duration-500 group-hover:-translate-y-full font-black">Explore Solutions</span>
                    </span>
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-500 group-hover:translate-x-3" />
                  </div>
                </div>

                {/* Decorative Pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] group-hover:opacity-[0.04] transition-opacity" />
              </Link>
            </div>
          ))}
        </StaggerContainer>

        <div className="text-center mt-12">
          <Magnetic strength={0.3}>
            <Button asChild className="text-white rounded-full px-8 py-3 h-12 font-bold transition-all hover:bg-blue-700 bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-95">
              <Link href="/services">View All Services</Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
