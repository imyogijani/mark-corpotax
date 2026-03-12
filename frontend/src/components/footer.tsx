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
  const [division, setDivision] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const savedDiv = localStorage.getItem("user_division");
      setDivision(savedDiv);

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
    settings.company_tagline || (division === 'taxation' ? "Taxation & Legal Division" : "Finance & Loan Division");
  const companyDescription =
    footerSettings.company_description ||
    (division === 'taxation' 
      ? "Leading destination for comprehensive auditing, legal compliance, and strategic tax planning since 2012."
      : "Founded in 2012 in Surat, Gujarat. Delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.");
  const address =
    settings.address ||
    "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003";
  const phoneFinance = settings.phone_finance || "97120 67891/92";
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

  const defaultServiceLinks: FooterLink[] = division === "taxation" 
    ? [
        { label: "Audit & Assurance", url: "/services/audit-assurance" },
        { label: "Direct & Indirect Tax", url: "/services/income-tax" },
        { label: "GST Compliance", url: "/services/gst-compliance" },
        { label: "Corporate ROC Services", url: "/services/roc" },
      ]
    : [
        { label: "MSME Project Finance", url: "/services/msme-project-finance" },
        { label: "Working Capital", url: "/services/working-capital" },
        { label: "Home Loans", url: "/services/home-loan" },
        { label: "Business Loans", url: "/services/business-loan" },
      ];

  const displayQuickLinks =
    quickLinks.length > 0 ? quickLinks : defaultQuickLinks;
  const displayServiceLinks =
    serviceLinks.length > 0 ? serviceLinks : defaultServiceLinks;

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950 text-slate-400">
      <div className="container max-w-screen-xl py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="footer-widget lg:col-span-2">
            <div className="mb-8">
              <Link href="/" className="brand-container inline-flex items-center gap-3 group">
                <Logo
                  className="object-contain flex-shrink-0 transition-transform group-hover:scale-110"
                  width={48}
                  height={48}
                />
                <div className="brand-info">
                  <span className="text-xl font-black text-white tracking-tight block leading-tight uppercase">
                    {companyName}
                  </span>
                  <span className={`text-[10px] font-black ${division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'} uppercase tracking-[0.3em] block`}>
                    {companyTagline}
                  </span>
                </div>
              </Link>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm font-medium">
              {companyDescription}
            </p>
            <div className="text-slate-400 text-sm space-y-3 mb-8">
              <p className="flex items-start gap-2">
                <strong className="text-white font-black min-w-[70px] uppercase text-[10px] tracking-widest">Address:</strong>
                <span className="leading-relaxed opacity-80">{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <strong className="text-white font-black min-w-[70px] uppercase text-[10px] tracking-widest">Finance:</strong>
                <Link href={`tel:${phoneFinance}`} className={`hover:${division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'} transition-colors opacity-80`}>{phoneFinance}</Link>
              </p>
              <p className="flex items-center gap-2">
                <strong className="text-white font-black min-w-[70px] uppercase text-[10px] tracking-widest">Taxation:</strong>
                <Link href={`tel:${phoneTaxation}`} className={`hover:${division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'} transition-colors opacity-80`}>{phoneTaxation}</Link>
              </p>
              <p className="flex items-center gap-2">
                <strong className="text-white font-black min-w-[70px] uppercase text-[10px] tracking-widest">Email:</strong>
                <Link href={`mailto:${email}`} className={`hover:${division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'} transition-colors uppercase tracking-wider text-[10px] font-bold opacity-80`}>{email}</Link>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={facebookUrl}
                className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${division === 'taxation' ? 'hover:border-emerald-500/50' : 'hover:border-blue-500/50'} transition-all duration-300 shadow-xl group`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Facebook size={18} />
                </motion.div>
              </Link>
              <Link
                href={twitterUrl}
                className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${division === 'taxation' ? 'hover:border-emerald-500/50' : 'hover:border-blue-500/50'} transition-all duration-300 shadow-xl group`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: -10 }}>
                  <Twitter size={18} />
                </motion.div>
              </Link>
              <Link
                href={linkedinUrl}
                className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${division === 'taxation' ? 'hover:border-emerald-500/50' : 'hover:border-blue-500/50'} transition-all duration-300 shadow-xl group`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div whileHover={{ scale: 1.2, y: -3 }}>
                  <Linkedin size={18} />
                </motion.div>
              </Link>
              <Link
                href={instagramUrl}
                className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${division === 'taxation' ? 'hover:border-emerald-500/50' : 'hover:border-blue-500/50'} transition-all duration-300 shadow-xl group`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Instagram size={18} />
                </motion.div>
              </Link>
            </div>
          </div>
          <div className="footer-widget">
            <h4 className="font-black text-white mb-6 uppercase tracking-[0.3em] text-[10px]">
              {quickLinksTitle}
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-widest text-[10px]">
              {displayQuickLinks.map((link: FooterLink, index: number) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className={`text-slate-500 ${division === 'taxation' ? 'hover:text-emerald-400' : 'hover:text-blue-400'} transition-colors inline-block hover:translate-x-1 transition-transform`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-widget">
            <h4 className="font-black text-white mb-6 uppercase tracking-[0.3em] text-[10px]">
              {servicesTitle}
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-widest text-[10px]">
              {displayServiceLinks.map((link: FooterLink, index: number) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className={`text-slate-500 ${division === 'taxation' ? 'hover:text-emerald-400' : 'hover:text-blue-400'} transition-colors inline-block hover:translate-x-1 transition-transform`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-widget">
            <h4 className="font-black text-white mb-6 uppercase tracking-[0.3em] text-[10px]">
              {newsletterTitle}
            </h4>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 leading-relaxed">
              {newsletterDescription}
            </p>
            <form className={`flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-3xl shadow-2xl focus-within:ring-2 ${division === 'taxation' ? 'focus-within:ring-emerald-500/20' : 'focus-within:ring-blue-500/20'} transition-all`}>
              <Input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-grow bg-transparent border-none shadow-none text-white placeholder:text-slate-600 focus-visible:ring-0 pl-4 h-10 min-w-0 font-black text-[10px] tracking-widest"
              />
              <Button
                type="submit"
                size="sm"
                className={`rounded-2xl ${division === 'taxation' ? 'bg-emerald-600' : 'bg-blue-600'} hover:bg-white hover:text-slate-950 text-white px-5 h-10 text-[10px] font-black uppercase tracking-widest transition-all`}
              >
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 text-center gap-6">
          <p className="hover:text-slate-400 transition-colors cursor-default">{copyrightText}</p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className={`hover:${division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'} transition-colors`}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className={`hover:${division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'} transition-colors`}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
