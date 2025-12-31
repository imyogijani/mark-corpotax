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
        "services_list"
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
      Landmark: <Landmark className="w-12 h-12" style={{ color: "#0b4c80" }} />,
      ShieldCheck: (
        <ShieldCheck className="w-12 h-12" style={{ color: "#0b4c80" }} />
      ),
      ShieldHalf: <Shield className="w-12 h-12" style={{ color: "#0b4c80" }} />,
      Briefcase: (
        <Briefcase className="w-12 h-12" style={{ color: "#0b4c80" }} />
      ),
      Building2: (
        <Building2 className="w-12 h-12" style={{ color: "#0b4c80" }} />
      ),
      HandCoins: (
        <HandCoins className="w-12 h-12" style={{ color: "#0b4c80" }} />
      ),
      Home: <Home className="w-12 h-12" style={{ color: "#0b4c80" }} />,
      Award: <Award className="w-12 h-12" style={{ color: "#0b4c80" }} />,
      FileText: <FileText className="w-12 h-12" style={{ color: "#0b4c80" }} />,
      PiggyBank: (
        <PiggyBank className="w-12 h-12" style={{ color: "#0b4c80" }} />
      ),
      University: (
        <GraduationCap className="w-12 h-12" style={{ color: "#0b4c80" }} />
      ),
      Factory: <Factory className="w-12 h-12" style={{ color: "#0b4c80" }} />,
    };
    return (
      iconMap[iconName] || (
        <Briefcase className="w-12 h-12" style={{ color: "#0b4c80" }} />
      )
    );
  };

  // Show only first 3 services on homepage
  const displayServices = useMemo(() => services.slice(0, 3), [services]);

  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial solutions for your business success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              {getIcon(service.icon || "")}
              <h3 className="text-xl font-semibold mb-2 mt-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <Button
                className="text-white rounded-full px-6 py-2 font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0b4c80" }}
                asChild
              >
                <Link
                  href={
                    service.slug ? `/services/${service.slug}` : "/services"
                  }
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button
            asChild
            className="text-white rounded-full px-8 py-3 h-12 font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0b4c80" }}
          >
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
