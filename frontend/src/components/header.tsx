"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, BookUser, LogIn, Phone } from "lucide-react";
import { Logo } from "./logo-image";
import { contentService } from "@/lib/content-service";

const defaultNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  phone_finance?: string;
  phone_taxation?: string;
}

export function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings>({});
  const [navLinks] = useState(defaultNavLinks);

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
        setSettings({ ...headerSettings, ...contactSettings });
      } catch (error) {
        console.error("Error loading header settings:", error);
      }
    };
    loadSettings();
  }, []);

  const companyName = settings.company_name || "Mark Corpotext";
  const companyTagline =
    settings.company_tagline || "Financial & Legal Solutions";
  const phoneNumber = settings.phone_finance || "97120 67891";

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 md:h-24 lg:h-28 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-48 flex items-center space-x-3">
            <Logo className="object-contain" width={40} height={40} />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800">
                {companyName}
              </span>
              <span className="text-sm text-gray-600">{companyTagline}</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm lg:gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 font-medium ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground/80"
                } after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 ${
                  isActive(link.href)
                    ? "after:scale-x-100"
                    : "hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="object-contain" width={32} height={32} />
            <div className="flex flex-col">
              <span className="font-bold text-base text-gray-800">
                {companyName}
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                {companyTagline}
              </span>
            </div>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex flex-col items-center border-b pb-4 space-y-3">
                  <Logo className="object-contain" width={80} height={80} />
                  <div className="text-center">
                    <span className="font-bold text-lg text-gray-800 block">
                      {companyName}
                    </span>
                    <span className="text-sm text-gray-600">
                      {companyTagline}
                    </span>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col gap-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`rounded-lg p-2 text-lg transition-colors ${
                          isActive(link.href)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto">
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-2 font-medium transition-colors"
                    >
                      <Link href="/appointment">
                        <BookUser className="mr-2" size={16} />
                        Book Appointment
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden flex-1 items-center justify-end md:flex">
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 text-primary bg-primary/10 p-2 rounded-full flex items-center justify-center">
                <Phone size={16} />
              </div>
              <div className="hidden xl:block">
                <p className="text-xs text-muted-foreground">
                  Finance Division
                </p>
                <p className="font-semibold">{phoneNumber}</p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-2 font-medium transition-colors"
            >
              <Link href="/appointment">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
