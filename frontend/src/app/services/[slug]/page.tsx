"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SubscribeCta } from "@/components/subscribe-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contentService } from "@/lib/content-service";
import {
  Building2,
  TrendingUp,
  Landmark,
  Calculator,
  CreditCard,
  ShieldHalf,
  PiggyBank,
  HandCoins,
  Briefcase,
  University,
} from "lucide-react";

// Default services fallback - matches the services page
const defaultServices = [
  {
    slug: "msme-project-finance",
    icon: "Building2",
    title: "MSME Project Finance",
    description:
      "Complete project financing solutions for small and medium enterprises to fuel business growth and expansion.",
    image:
      "https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2670&auto=format&fit=crop",
    dataAiHint: "business finance",
    fullDescription:
      "Our MSME Project Finance solutions are designed to provide comprehensive funding support for small and medium enterprises. We understand the unique challenges faced by MSMEs and offer tailored financing options that align with your business goals and growth trajectory.",
    features: [
      "Flexible repayment options",
      "Competitive interest rates",
      "Quick approval process",
      "Minimal documentation",
    ],
  },
  {
    slug: "working-capital",
    icon: "TrendingUp",
    title: "Working Capital Solutions",
    description:
      "Flexible working capital loans to manage day-to-day operations and maintain healthy cash flow.",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2670&auto=format&fit=crop",
    dataAiHint: "business cash flow",
    fullDescription:
      "Maintain smooth business operations with our Working Capital Solutions. We provide the financial flexibility you need to manage inventory, payroll, and day-to-day expenses without disrupting your business rhythm.",
    features: [
      "Short-term and long-term options",
      "Overdraft facilities",
      "Invoice financing",
      "Seasonal business support",
    ],
  },
  {
    slug: "home-mortgage-loans",
    icon: "Landmark",
    title: "Home & Mortgage Loans",
    description:
      "Affordable home loans with competitive interest rates to help you realize your dream of owning a home.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059ee353?q=80&w=2574&auto=format&fit=crop",
    dataAiHint: "home mortgage",
    fullDescription:
      "Turn your dream of homeownership into reality with our comprehensive Home & Mortgage Loan solutions. We offer competitive rates, flexible terms, and personalized guidance throughout the entire home buying process.",
    features: [
      "Low interest rates",
      "Up to 90% loan-to-value",
      "Long tenure options",
      "Balance transfer facility",
    ],
  },
  {
    slug: "tax-planning",
    icon: "Calculator",
    title: "Taxation Services",
    description:
      "Expert tax planning and compliance services to minimize liabilities and maximize savings.",
    image:
      "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2670&auto=format&fit=crop",
    dataAiHint: "tax documents",
    fullDescription:
      "Navigate the complex world of taxation with confidence. Our expert tax planning services help you minimize liabilities, maximize savings, and ensure complete compliance with all regulatory requirements.",
    features: [
      "Income tax planning",
      "GST compliance",
      "Tax return filing",
      "Tax audit support",
    ],
  },
  {
    slug: "business-loans",
    icon: "CreditCard",
    title: "Business Loans",
    description:
      "Quick and hassle-free business loans to support your entrepreneurial journey and business goals.",
    image:
      "https://images.unsplash.com/photo-1543286386-71314a4769de?q=80&w=2670&auto=format&fit=crop",
    dataAiHint: "business growth",
    fullDescription:
      "Fuel your business growth with our comprehensive Business Loan solutions. Whether you are starting a new venture or expanding an existing one, we provide the financial support you need to achieve your entrepreneurial goals.",
    features: [
      "Unsecured loan options",
      "Collateral-free financing",
      "Quick disbursement",
      "Flexible usage",
    ],
  },
  {
    slug: "government-schemes",
    icon: "ShieldHalf",
    title: "Government Schemes",
    description:
      "Assistance with various government loan schemes and subsidies for eligible businesses and individuals.",
    image:
      "https://images.unsplash.com/photo-1563291074-2c8821617495?q=80&w=2670&auto=format&fit=crop",
    dataAiHint: "government support",
    fullDescription:
      "Take advantage of various government schemes and subsidies designed to support businesses and individuals. We help you navigate the application process and maximize the benefits available to you.",
    features: [
      "PMEGP scheme assistance",
      "Mudra loan facilitation",
      "Startup India support",
      "Subsidy applications",
    ],
  },
];

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-10 w-10 text-primary" />,
  TrendingUp: <TrendingUp className="h-10 w-10 text-primary" />,
  Landmark: <Landmark className="h-10 w-10 text-primary" />,
  Calculator: <Calculator className="h-10 w-10 text-primary" />,
  CreditCard: <CreditCard className="h-10 w-10 text-primary" />,
  ShieldHalf: <ShieldHalf className="h-10 w-10 text-primary" />,
  PiggyBank: <PiggyBank className="h-10 w-10 text-primary" />,
  HandCoins: <HandCoins className="h-10 w-10 text-primary" />,
  FileText: <FileText className="h-10 w-10 text-primary" />,
  University: <University className="h-10 w-10 text-primary" />,
  Briefcase: <Briefcase className="h-10 w-10 text-primary" />,
};

const downloadLinks = [
  { text: "Service Brochure.pdf", href: "#" },
  { text: "Eligibility Criteria.pdf", href: "#" },
  { text: "Required Documents.pdf", href: "#" },
];

interface ServiceData {
  slug: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  dataAiHint: string;
  fullDescription?: string;
  features?: string[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [service, setService] = useState<ServiceData | null>(null);
  const [allServices, setAllServices] =
    useState<ServiceData[]>(defaultServices);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // Fetch services from backend
        const data = await contentService.getPageContent("services");

        // Transform services from flat keys to array
        const transformedServices: ServiceData[] = [];
        if (data?.services_list) {
          for (let i = 1; i <= 6; i++) {
            const serviceSlug =
              data.services_list[`service_${i}_slug`] ||
              defaultServices[i - 1]?.slug;
            const serviceData: ServiceData = {
              slug: serviceSlug,
              icon:
                data.services_list[`service_${i}_icon`] ||
                defaultServices[i - 1]?.icon ||
                "Briefcase",
              title:
                data.services_list[`service_${i}_title`] ||
                defaultServices[i - 1]?.title ||
                `Service ${i}`,
              description:
                data.services_list[`service_${i}_description`] ||
                defaultServices[i - 1]?.description ||
                "",
              image: defaultServices[i - 1]?.image || "",
              dataAiHint: defaultServices[i - 1]?.dataAiHint || "service",
              fullDescription:
                data.services_list[`service_${i}_full_description`] ||
                defaultServices[i - 1]?.fullDescription ||
                "",
              features: defaultServices[i - 1]?.features || [],
            };
            if (serviceData.title) transformedServices.push(serviceData);
          }
        }

        const finalServices =
          transformedServices.length > 0
            ? transformedServices
            : defaultServices;
        setAllServices(finalServices);

        // Find the current service by slug
        const currentService = finalServices.find((s) => s.slug === slug);

        if (currentService) {
          setService(currentService);
        } else {
          setNotFoundState(true);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        // Fallback to default services
        const currentService = defaultServices.find((s) => s.slug === slug);
        if (currentService) {
          setService(currentService);
          setAllServices(defaultServices);
        } else {
          setNotFoundState(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchServiceData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFoundState || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The service you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/services">View All Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="service-detail-page-container animate-fade-in">
      <section className="page-header-section relative bg-secondary/20 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl gradient-text">
            Service Details
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Home / <span className="text-primary">{service.title}</span>
          </p>
        </div>
      </section>

      <section className="content-section py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="service-main-content space-y-8 lg:col-span-2">
              <div className="image-wrapper relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  data-ai-hint={service.dataAiHint}
                  priority
                />
              </div>

              <div className="flex items-center gap-4">
                {iconComponents[service.icon] || (
                  <Briefcase className="h-10 w-10 text-primary" />
                )}
                <h2 className="text-3xl font-bold md:text-4xl">
                  {service.title}
                </h2>
              </div>

              <p className="text-lg text-muted-foreground">
                {service.description}
              </p>

              {service.fullDescription && (
                <p className="text-muted-foreground">
                  {service.fullDescription}
                </p>
              )}

              {service.features && service.features.length > 0 && (
                <div className="features-grid grid gap-8 py-6 md:grid-cols-2">
                  {service.features.map((feature, index) => (
                    <Card
                      key={index}
                      className="feature-card bg-secondary/20 border-border/40"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          {feature}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              <div className="expert-matters-section space-y-6">
                <h3 className="text-2xl font-bold md:text-3xl">
                  Why Choose Us?
                </h3>
                <div className="grid items-center gap-8 md:grid-cols-2">
                  <div className="text-content order-2 md:order-1">
                    <p className="mb-4 text-muted-foreground">
                      Our team of seasoned professionals brings years of
                      experience and expertise to help you achieve your
                      financial goals. We are committed to providing
                      personalized solutions that meet your unique needs.
                    </p>
                    <p className="text-muted-foreground">
                      With a proven track record of success and a client-first
                      approach, we ensure that every step of your financial
                      journey is smooth and rewarding.
                    </p>
                  </div>
                  <div className="image-content-inner relative h-64 w-full overflow-hidden rounded-lg order-1 md:order-2">
                    <Image
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
                      alt="Expert team discussion"
                      fill
                      className="object-cover"
                      data-ai-hint="business meeting"
                    />
                  </div>
                </div>
              </div>
            </div>

            <aside className="sidebar space-y-8">
              <Card className="services-card bg-secondary/20 border-border/40">
                <CardHeader>
                  <CardTitle>Our Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {allServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className={`flex items-center justify-between rounded-md p-3 transition-colors ${
                            slug === s.slug
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-primary/20"
                          }`}
                        >
                          <span>{s.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="cta-card relative overflow-hidden border-border/40 bg-secondary/40 p-8 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30 opacity-50"></div>
                <div className="relative z-10">
                  <Phone className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">Request a Call</h3>
                  <p className="mb-4 text-2xl font-bold">97120 67891</p>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </Card>

              <Card className="download-card bg-secondary/20 border-border/40">
                <CardHeader>
                  <CardTitle>Download Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {downloadLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                        >
                          <FileText className="mr-3 h-5 w-5 flex-shrink-0" />
                          <span className="flex-grow">{link.text}</span>
                          <Download className="h-5 w-5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <SubscribeCta />
    </div>
  );
}
