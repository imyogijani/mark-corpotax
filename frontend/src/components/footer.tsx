"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./logo-image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { DribbbleIcon } from "./logo";
import { contentService } from "@/lib/content-service";

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

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const headerSettings = await contentService.getContentBySection(
          "settings",
          "header"
        );
        const contactSettings = await contentService.getContentBySection(
          "settings",
          "contact"
        );
        const socialSettings = await contentService.getContentBySection(
          "settings",
          "social"
        );
        setSettings({
          ...headerSettings,
          ...contactSettings,
          ...socialSettings,
        });
      } catch (error) {
        console.error("Error loading footer settings:", error);
      }
    };
    loadSettings();
  }, []);

  const companyName = settings.company_name || "Mark Corpotext";
  const companyTagline =
    settings.company_tagline || "Financial & Legal Solutions";
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
              Founded in 2012 in Surat, Gujarat. Delivering comprehensive
              financial and legal solutions designed to address the unique
              requirements of our clients.
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
                <Facebook size={20} />
              </Link>
              <Link
                href={twitterUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href={linkedinUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href={instagramUrl}
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>
          <div className="footer-widget">
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-600 hover:text-primary"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/appointment"
                  className="text-gray-600 hover:text-primary"
                >
                  Appointments
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-widget">
            <h4 className="font-semibold text-gray-800 mb-4">Utility Pages</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-widget">
            <h4 className="font-semibold text-gray-800 mb-4">Subscribe</h4>
            <p className="text-gray-600 text-sm mb-4">
              Join our community to get the latest updates.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MARK GROUP. All Rights Reserved.
          </p>
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
