"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Logo } from "./logo-image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { contentService } from "@/lib/content-service";
import { motion } from "framer-motion";

interface FooterLink {
  label: string;
  url: string;
}

interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  address?: string;
  phone_finance?: string;
  phone_taxation?: string;
  email?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

interface FooterSettings {
  company_description?: string;
  copyright_text?: string;
  newsletter_title?: string;
  newsletter_description?: string;
  quick_links_title?: string;
  services_title?: string;
  working_hours_title?: string;
  working_hours_weekday?: string;
  working_hours_saturday?: string;
  working_hours_sunday?: string;
}

interface FooterLinksSettings {
  [key: string]: string;
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({});
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>([]);
  const [serviceLinks, setServiceLinks] = useState<FooterLink[]>([]);

  const loadSettings = useCallback(async () => {
    try {
      const headerSettings = await contentService.getContentBySection(
        "settings",
        "header",
      );
      const contactSettings = await contentService.getContentBySection(
        "settings",
        "contact",
      );
      const socialSettings = await contentService.getContentBySection(
        "settings",
        "social",
      );
      const footer = await contentService.getContentBySection(
        "settings",
        "footer",
      );
      const footerLinksData: FooterLinksSettings =
        await contentService.getContentBySection("settings", "footer_links");
      const footerServicesData: FooterLinksSettings =
        await contentService.getContentBySection("settings", "footer_services");

      setSettings({
        ...headerSettings,
        ...contactSettings,
        ...socialSettings,
      });
      setFooterSettings(footer || {});

      // Build quick links from settings
      if (footerLinksData && Object.keys(footerLinksData).length > 0) {
        const links: FooterLink[] = [];
        for (let i = 1; i <= 6; i++) {
          const label = footerLinksData[`link_${i}_label`];
          const url = footerLinksData[`link_${i}_url`];
          if (label && url) {
            links.push({ label, url });
          }
        }
        if (links.length > 0) {
          setQuickLinks(links);
        }
      }

      // Build service links from settings
      if (footerServicesData && Object.keys(footerServicesData).length > 0) {
        const links: FooterLink[] = [];
        for (let i = 1; i <= 6; i++) {
          const label = footerServicesData[`service_${i}_label`];
          const url = footerServicesData[`service_${i}_url`];
          if (label && url) {
            links.push({ label, url });
          }
        }
        if (links.length > 0) {
          setServiceLinks(links);
        }
      }
    } catch (error) {
      console.error("Error loading footer settings:", error);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    // Subscribe to cache invalidation events to refresh when content is updated
    const unsubscribe = contentService.onCacheInvalidated(() => {
      loadSettings();
    });

    return () => {
      unsubscribe();
    };
  }, [loadSettings]);

  const companyName = settings.company_name || "Mark Corpotax";
  const companyTagline =
    settings.company_tagline || "Financial & Legal Solutions";
  const companyDescription =
    footerSettings.company_description ||
    "Founded in 2012 in Surat, Gujarat. Delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.";
  const address =
    settings.address ||
    "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003";
  const phoneFinance = settings.phone_finance || "97120 67891";
  const phoneTaxation = settings.phone_taxation || "97738 22604";
  const email = settings.email || "markcorpotax@gmail.com";
  const website = settings.website || "markcorpotax.com";
  const facebookUrl = settings.facebook || "#";
  const twitterUrl = settings.twitter || "#";
  const linkedinUrl = settings.linkedin || "#";
  const instagramUrl = settings.instagram || "#";

  const quickLinksTitle = footerSettings.quick_links_title || "Quick Links";
  const servicesTitle = footerSettings.services_title || "Our Services";
  const newsletterTitle = footerSettings.newsletter_title || "Subscribe";
  const newsletterDescription =
    footerSettings.newsletter_description ||
    "Join our community to get the latest updates.";
  const copyrightText =
    footerSettings.copyright_text ||
    `© ${new Date().getFullYear()} MARK GROUP. All Rights Reserved.`;

  // Default links if none from CMS
  const defaultQuickLinks: FooterLink[] = [
    { label: "About Us", url: "/about" },
    { label: "Services", url: "/services" },
    { label: "Blog", url: "/blog" },
    { label: "Contact", url: "/contact" },
    { label: "Appointments", url: "/appointment" },
  ];

  const defaultServiceLinks: FooterLink[] = [
    { label: "MSME Project Finance", url: "/services/msme-project-finance" },
    { label: "Working Capital", url: "/services/working-capital" },
    { label: "Home & Mortgage Loans", url: "/services/home-mortgage-loans" },
    { label: "Taxation Services", url: "/services/tax-planning" },
    { label: "Business Loans", url: "/services/business-loans" },
  ];

  const displayQuickLinks =
    quickLinks.length > 0 ? quickLinks : defaultQuickLinks;
  const displayServiceLinks =
    serviceLinks.length > 0 ? serviceLinks : defaultServiceLinks;

  return (
    <footer className="w-full border-t border-gray-200 bg-[#ffffff] text-gray-700">
      <div className="container max-w-screen-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="footer-widget lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="brand-container inline-flex">
                <Logo
                  className="object-contain flex-shrink-0"
                  width={48}
                  height={48}
                />
                <div className="brand-info">
                  <span className="brand-text">{companyName}</span>
                  <span className="brand-subtitle">{companyTagline}</span>
                </div>
              </Link>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {companyDescription}
            </p>
            <div className="text-gray-600 text-sm space-y-2 mb-6">
              <p>
                <strong className="text-gray-800">Address:</strong> {address}
              </p>
              <p>
                <strong className="text-gray-800">Finance Division:</strong>{" "}
                {phoneFinance}
              </p>
              <p>
                <strong className="text-gray-800">Taxation Division:</strong>{" "}
                {phoneTaxation}
              </p>
              <p>
                <strong className="text-gray-800">Email:</strong> {email}
              </p>
              <p>
                <strong className="text-gray-800">Website:</strong> {website}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={facebookUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Facebook size={20} />
                </motion.div>
              </Link>
              <Link
                href={twitterUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Twitter size={20} />
                </motion.div>
              </Link>
              <Link
                href={linkedinUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Linkedin size={20} />
                </motion.div>
              </Link>
              <Link
                href={instagramUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Instagram size={20} />
                </motion.div>
              </Link>
            </div>
          </div>
          <div className="footer-widget">
            <h4 className="font-semibold text-gray-800 mb-4">
              {quickLinksTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              {displayQuickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-gray-600 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-widget">
            <h4 className="font-semibold text-gray-800 mb-4">
              {servicesTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              {displayServiceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-gray-600 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-widget">
            <h4 className="font-semibold text-gray-800 mb-4">
              {newsletterTitle}
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              {newsletterDescription}
            </p>
            <form className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-transparent border-none shadow-none text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 pl-4 h-9 min-w-0"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full bg-[#0b4c80] hover:bg-[#093e69] text-white px-4 h-9 text-xs font-medium transition-colors"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>{copyrightText}</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
