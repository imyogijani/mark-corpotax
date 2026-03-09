"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
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
import {
  StaggerContainer,
  StaggerItem,
  MotionWrapper,
} from "@/components/MotionWrapper";
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

// Static fallback content
const FALLBACK_SERVICES: ServiceItem[] = [
  {
    title: "MSME Machinery Loan",
    description:
      "Get financing for machinery and equipment with government subsidy benefits",
    icon: "Building2",
    slug: "msme-loan",
  },
  {
    title: "Working Capital Finance",
    description:
      "Flexible working capital solutions to manage your business operations",
    icon: "HandCoins",
    slug: "working-capital",
  },
  {
    title: "Project Finance",
    description:
      "Complete project financing solutions for your business expansion",
    icon: "Briefcase",
    slug: "project-finance",
  },
];

export function DynamicServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);

  const fetchContent = useCallback(async () => {
    try {
      const servicesContent = await contentService.getContentBySection(
        "services",
        "services_list",
      );
      if (
        servicesContent?.services_list &&
        Array.isArray(servicesContent.services_list)
      ) {
        setServices(servicesContent.services_list);
      }
    } catch (error) {
      console.error("Error loading services content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      unsubscribe();
    };
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

    const iconElement = iconMap[iconName] || (
      <Briefcase className="w-12 h-12" />
    );

    return (
      <motion.div
        whileHover={{ rotateY: 180, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="origin-center"
      >
        {iconElement}
      </motion.div>
    );
  };

  // Show only first 3 services on homepage
  const displayServices = useMemo(() => services.slice(0, 3), [services]);

  return (
    <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
      <ScrollWatermark text="SOLUTIONS" className="top-20 left-10 opacity-20" />

      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark */}
          <ScrollWatermark
            text="SERVICES"
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="w-8 h-[2px] bg-blue-500"></span>
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                What We Offer
              </span>
              <span className="w-8 h-[2px] bg-blue-500"></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              Comprehensive Financial Solutions
            </motion.h2>

            <motion.p
              className="text-lg text-slate-600 max-w-2xl mx-auto"
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
        <StaggerContainer
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          viewport={{ once: false, amount: 0.1 }}
        >
          {displayServices.map((service, index) => (
            <StaggerItem key={index} hoverEffect={false}>
              <Link
                href={service.slug ? `/services/${service.slug}` : "/services"}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 text-left no-underline transition-all duration-500 hover:shadow-[0_20px_50px_rgba(11,76,128,0.15)] hover:-translate-y-2 hover:border-blue-300"
              >
                {/* Expanding Circle Background - Using Brand Blue */}
                <div
                  className="absolute -right-20 -top-20 -z-0 h-40 w-40 rounded-full transition-transform duration-700 ease-in-out group-hover:scale-[20]"
                  style={{ backgroundColor: "#0b4c80" }}
                ></div>

                {/* Go Corner */}
                <div
                  className="absolute right-0 top-0 flex h-16 w-16 items-center justify-center overflow-hidden rounded-bl-[50px] z-10 transition-opacity duration-300 group-hover:opacity-0"
                  style={{
                    background: "linear-gradient(135deg, #6293c8, #0b4c80)",
                  }}
                >
                  <div className="absolute top-4 right-4 font-mono text-xl text-white">
                    →
                  </div>
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-6 text-blue-400 transition-colors duration-500 group-hover:text-white">
                      {getIcon(service.icon || "")}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors duration-500 group-hover:text-white">
                      {service.title}
                    </h3>
                    <p className="text-base text-slate-500 transition-colors duration-500 group-hover:text-white/90">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-sm font-bold text-[#0b4c80] opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-white">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="text-center mt-12">
          <Magnetic strength={0.3}>
            <Button
              asChild
              className="text-white rounded-full px-8 py-3 h-12 font-medium transition-colors hover:opacity-90 border border-blue-600/30 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              <Link href="/services">View All Services</Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
