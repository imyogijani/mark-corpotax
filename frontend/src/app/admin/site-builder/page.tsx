"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Check, AlertCircle, RefreshCw } from "lucide-react";
import { authFetch } from "@/lib/auth";
import { contentService } from "@/lib/content-service";

interface HeaderSettings {
  company_name: string;
  company_tagline: string;
  show_phone: boolean;
  phone_display: string;
  cta_text: string;
  cta_link: string;
  nav_items: { label: string; link: string }[];
}

interface FooterSettings {
  company_name: string;
  company_tagline: string;
  company_description: string;
  copyright_text: string;
  phone_finance: string;
  phone_taxation: string;
  email: string;
  address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  quick_links: { label: string; url: string }[];
  service_links: { label: string; url: string }[];
}

const defaultHeaderSettings: HeaderSettings = {
  company_name: "Mark Corpotax",
  company_tagline: "Financial & Legal Solutions",
  show_phone: true,
  phone_display: "97120 67891",
  cta_text: "Get a Quote",
  cta_link: "/appointment",
  nav_items: [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Services", link: "/services" },
    { label: "Blog", link: "/blog" },
    { label: "Contact", link: "/contact" },
  ],
};

const defaultFooterSettings: FooterSettings = {
  company_name: "Mark Corpotax",
  company_tagline: "Financial & Legal Solutions",
  company_description:
    "Founded in 2012 in Surat, Gujarat. Delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.",
  copyright_text: `© ${new Date().getFullYear()} Mark Corpotax. All Rights Reserved.`,
  phone_finance: "97120 67891",
  phone_taxation: "97738 22604",
  email: "markcorpotax@gmail.com",
  address:
    "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003",
  facebook: "#",
  twitter: "#",
  linkedin: "#",
  instagram: "#",
  quick_links: [
    { label: "About Us", url: "/about" },
    { label: "Services", url: "/services" },
    { label: "Blog", url: "/blog" },
    { label: "Contact", url: "/contact" },
    { label: "Appointments", url: "/appointment" },
  ],
  service_links: [
    { label: "MSME Project Finance", url: "/services/msme-project-finance" },
    { label: "Working Capital", url: "/services/working-capital" },
    { label: "Home & Mortgage Loans", url: "/services/home-mortgage-loans" },
    { label: "Taxation Services", url: "/services/tax-planning" },
    { label: "Business Loans", url: "/services/business-loans" },
  ],
};

export default function SiteBuilderPage() {
  const { setTitle } = useAdmin();
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>(
    defaultHeaderSettings
  );
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(
    defaultFooterSettings
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"header" | "footer" | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    header?: "success" | "error";
    footer?: "success" | "error";
  }>({});

  useEffect(() => {
    setTitle("Header & Footer");
  }, [setTitle]);

  // Load settings from database
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Clear cache first to get fresh data
      contentService.clearCache();

      // Load header settings
      const headerData = await contentService.getContentBySection(
        "settings",
        "header"
      );
      const navData = await contentService.getContentBySection(
        "settings",
        "navigation"
      );
      const contactData = await contentService.getContentBySection(
        "settings",
        "contact"
      );

      // Load footer settings
      const footerData = await contentService.getContentBySection(
        "settings",
        "footer"
      );
      const socialData = await contentService.getContentBySection(
        "settings",
        "social"
      );
      const footerLinksData = await contentService.getContentBySection(
        "settings",
        "footer_links"
      );
      const footerServicesData = await contentService.getContentBySection(
        "settings",
        "footer_services"
      );

      // Build header settings
      const loadedHeaderSettings: HeaderSettings = {
        company_name:
          headerData?.company_name || defaultHeaderSettings.company_name,
        company_tagline:
          headerData?.company_tagline || defaultHeaderSettings.company_tagline,
        show_phone: headerData?.show_phone !== "false",
        phone_display:
          headerData?.phone_display ||
          contactData?.phone_finance ||
          defaultHeaderSettings.phone_display,
        cta_text: headerData?.cta_text || defaultHeaderSettings.cta_text,
        cta_link: headerData?.cta_link || defaultHeaderSettings.cta_link,
        nav_items: [],
      };

      // Build nav items from navigation data
      if (navData && Object.keys(navData).length > 0) {
        const navItems: { label: string; link: string }[] = [];
        for (let i = 1; i <= 6; i++) {
          const label = navData[`nav_${i}_label`];
          const link = navData[`nav_${i}_link`];
          if (label && link) {
            navItems.push({ label, link });
          }
        }
        if (navItems.length > 0) {
          loadedHeaderSettings.nav_items = navItems;
        } else {
          loadedHeaderSettings.nav_items = defaultHeaderSettings.nav_items;
        }
      } else {
        loadedHeaderSettings.nav_items = defaultHeaderSettings.nav_items;
      }

      // Build footer settings
      const loadedFooterSettings: FooterSettings = {
        company_name:
          headerData?.company_name || defaultFooterSettings.company_name,
        company_tagline:
          headerData?.company_tagline || defaultFooterSettings.company_tagline,
        company_description:
          footerData?.company_description ||
          defaultFooterSettings.company_description,
        copyright_text:
          footerData?.copyright_text || defaultFooterSettings.copyright_text,
        phone_finance:
          contactData?.phone_finance || defaultFooterSettings.phone_finance,
        phone_taxation:
          contactData?.phone_taxation || defaultFooterSettings.phone_taxation,
        email: contactData?.email || defaultFooterSettings.email,
        address: contactData?.address || defaultFooterSettings.address,
        facebook: socialData?.facebook || defaultFooterSettings.facebook,
        twitter: socialData?.twitter || defaultFooterSettings.twitter,
        linkedin: socialData?.linkedin || defaultFooterSettings.linkedin,
        instagram: socialData?.instagram || defaultFooterSettings.instagram,
        quick_links: [],
        service_links: [],
      };

      // Build quick links
      if (footerLinksData && Object.keys(footerLinksData).length > 0) {
        const links: { label: string; url: string }[] = [];
        for (let i = 1; i <= 6; i++) {
          const label = footerLinksData[`link_${i}_label`];
          const url = footerLinksData[`link_${i}_url`];
          if (label && url) {
            links.push({ label, url });
          }
        }
        loadedFooterSettings.quick_links =
          links.length > 0 ? links : defaultFooterSettings.quick_links;
      } else {
        loadedFooterSettings.quick_links = defaultFooterSettings.quick_links;
      }

      // Build service links
      if (footerServicesData && Object.keys(footerServicesData).length > 0) {
        const links: { label: string; url: string }[] = [];
        for (let i = 1; i <= 6; i++) {
          const label = footerServicesData[`service_${i}_label`];
          const url = footerServicesData[`service_${i}_url`];
          if (label && url) {
            links.push({ label, url });
          }
        }
        loadedFooterSettings.service_links =
          links.length > 0 ? links : defaultFooterSettings.service_links;
      } else {
        loadedFooterSettings.service_links =
          defaultFooterSettings.service_links;
      }

      setHeaderSettings(loadedHeaderSettings);
      setFooterSettings(loadedFooterSettings);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveHeaderSettings = async () => {
    setSaving("header");
    setSaveStatus({});
    try {
      // Save header section data
      const headerData = [
        {
          page: "settings",
          section: "header",
          key: "company_name",
          value: headerSettings.company_name,
        },
        {
          page: "settings",
          section: "header",
          key: "company_tagline",
          value: headerSettings.company_tagline,
        },
        {
          page: "settings",
          section: "header",
          key: "show_phone",
          value: headerSettings.show_phone ? "true" : "false",
        },
        {
          page: "settings",
          section: "header",
          key: "phone_display",
          value: headerSettings.phone_display,
        },
        {
          page: "settings",
          section: "header",
          key: "cta_text",
          value: headerSettings.cta_text,
        },
        {
          page: "settings",
          section: "header",
          key: "cta_link",
          value: headerSettings.cta_link,
        },
      ];

      // Save navigation items
      const navData = headerSettings.nav_items
        .map((item, index) => [
          {
            page: "settings",
            section: "navigation",
            key: `nav_${index + 1}_label`,
            value: item.label,
          },
          {
            page: "settings",
            section: "navigation",
            key: `nav_${index + 1}_link`,
            value: item.link,
          },
        ])
        .flat();

      const allData = [...headerData, ...navData];

      // Save all data
      await Promise.all(
        allData.map((item) =>
          authFetch("/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })
        )
      );

      // Clear backend cache explicitly
      await authFetch("/content/clear-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "settings" }),
      });

      // Clear frontend cache after saving
      contentService.clearCache();

      // Set flag for other tabs/pages to know content was updated
      localStorage.setItem("content_updated", Date.now().toString());

      setSaveStatus({ header: "success" });
      setTimeout(() => setSaveStatus({}), 3000);
    } catch (error) {
      console.error("Error saving header settings:", error);
      setSaveStatus({ header: "error" });
    } finally {
      setSaving(null);
    }
  };

  const saveFooterSettings = async () => {
    setSaving("footer");
    setSaveStatus({});
    try {
      // Save all footer-related data
      const footerData = [
        // Header section (shared company name/tagline)
        {
          page: "settings",
          section: "header",
          key: "company_name",
          value: footerSettings.company_name,
        },
        {
          page: "settings",
          section: "header",
          key: "company_tagline",
          value: footerSettings.company_tagline,
        },
        // Footer section
        {
          page: "settings",
          section: "footer",
          key: "company_description",
          value: footerSettings.company_description,
        },
        {
          page: "settings",
          section: "footer",
          key: "copyright_text",
          value: footerSettings.copyright_text,
        },
        // Contact section
        {
          page: "settings",
          section: "contact",
          key: "phone_finance",
          value: footerSettings.phone_finance,
        },
        {
          page: "settings",
          section: "contact",
          key: "phone_taxation",
          value: footerSettings.phone_taxation,
        },
        {
          page: "settings",
          section: "contact",
          key: "email",
          value: footerSettings.email,
        },
        {
          page: "settings",
          section: "contact",
          key: "address",
          value: footerSettings.address,
        },
        // Social section
        {
          page: "settings",
          section: "social",
          key: "facebook",
          value: footerSettings.facebook,
        },
        {
          page: "settings",
          section: "social",
          key: "twitter",
          value: footerSettings.twitter,
        },
        {
          page: "settings",
          section: "social",
          key: "linkedin",
          value: footerSettings.linkedin,
        },
        {
          page: "settings",
          section: "social",
          key: "instagram",
          value: footerSettings.instagram,
        },
      ];

      // Save quick links
      const quickLinksData = footerSettings.quick_links
        .map((item, index) => [
          {
            page: "settings",
            section: "footer_links",
            key: `link_${index + 1}_label`,
            value: item.label,
          },
          {
            page: "settings",
            section: "footer_links",
            key: `link_${index + 1}_url`,
            value: item.url,
          },
        ])
        .flat();

      // Save service links
      const serviceLinksData = footerSettings.service_links
        .map((item, index) => [
          {
            page: "settings",
            section: "footer_services",
            key: `service_${index + 1}_label`,
            value: item.label,
          },
          {
            page: "settings",
            section: "footer_services",
            key: `service_${index + 1}_url`,
            value: item.url,
          },
        ])
        .flat();

      const allData = [...footerData, ...quickLinksData, ...serviceLinksData];

      // Save all data
      await Promise.all(
        allData.map((item) =>
          authFetch("/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })
        )
      );

      // Clear backend cache explicitly
      await authFetch("/content/clear-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "settings" }),
      });

      // Clear frontend cache after saving
      contentService.clearCache();

      // Set flag for other tabs/pages to know content was updated
      localStorage.setItem("content_updated", Date.now().toString());

      setSaveStatus({ footer: "success" });
      setTimeout(() => setSaveStatus({}), 3000);
    } catch (error) {
      console.error("Error saving footer settings:", error);
      setSaveStatus({ footer: "error" });
    } finally {
      setSaving(null);
    }
  };

  const updateNavItem = (
    index: number,
    field: "label" | "link",
    value: string
  ) => {
    setHeaderSettings((prev) => ({
      ...prev,
      nav_items: prev.nav_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addNavItem = () => {
    if (headerSettings.nav_items.length < 6) {
      setHeaderSettings((prev) => ({
        ...prev,
        nav_items: [...prev.nav_items, { label: "", link: "" }],
      }));
    }
  };

  const removeNavItem = (index: number) => {
    setHeaderSettings((prev) => ({
      ...prev,
      nav_items: prev.nav_items.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Header & Footer Settings</h1>
          <p className="text-muted-foreground">
            Manage your website header and footer content
          </p>
        </div>
        <Button variant="outline" onClick={loadSettings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="header">Header Settings</TabsTrigger>
          <TabsTrigger value="footer">Footer Settings</TabsTrigger>
        </TabsList>

        {/* Header Settings Tab */}
        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
              <CardDescription>
                Company name and tagline displayed in the header
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-company-name">Company Name</Label>
                  <Input
                    id="header-company-name"
                    value={headerSettings.company_name}
                    onChange={(e) =>
                      setHeaderSettings((prev) => ({
                        ...prev,
                        company_name: e.target.value,
                      }))
                    }
                    placeholder="Mark Corpotax"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="header-tagline">Tagline</Label>
                  <Input
                    id="header-tagline"
                    value={headerSettings.company_tagline}
                    onChange={(e) =>
                      setHeaderSettings((prev) => ({
                        ...prev,
                        company_tagline: e.target.value,
                      }))
                    }
                    placeholder="Financial & Legal Solutions"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & CTA</CardTitle>
              <CardDescription>
                Phone number display and call-to-action button
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch
                  id="show-phone"
                  checked={headerSettings.show_phone}
                  onCheckedChange={(checked) =>
                    setHeaderSettings((prev) => ({
                      ...prev,
                      show_phone: checked,
                    }))
                  }
                />
                <Label htmlFor="show-phone">
                  Show phone number in header
                </Label>
              </div>
              {headerSettings.show_phone && (
                <div className="space-y-2">
                  <Label htmlFor="phone-display">Phone Number</Label>
                  <Input
                    id="phone-display"
                    value={headerSettings.phone_display}
                    onChange={(e) =>
                      setHeaderSettings((prev) => ({
                        ...prev,
                        phone_display: e.target.value,
                      }))
                    }
                    placeholder="97120 67891"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-text">CTA Button Text</Label>
                  <Input
                    id="cta-text"
                    value={headerSettings.cta_text}
                    onChange={(e) =>
                      setHeaderSettings((prev) => ({
                        ...prev,
                        cta_text: e.target.value,
                      }))
                    }
                    placeholder="Get a Quote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-link">CTA Button Link</Label>
                  <Input
                    id="cta-link"
                    value={headerSettings.cta_link}
                    onChange={(e) =>
                      setHeaderSettings((prev) => ({
                        ...prev,
                        cta_link: e.target.value,
                      }))
                    }
                    placeholder="/appointment"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>
                Configure navigation menu items (max 6)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {headerSettings.nav_items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={item.label}
                      onChange={(e) =>
                        updateNavItem(index, "label", e.target.value)
                      }
                      placeholder="Label"
                    />
                    <Input
                      value={item.link}
                      onChange={(e) =>
                        updateNavItem(index, "link", e.target.value)
                      }
                      placeholder="/path"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeNavItem(index)}
                    disabled={headerSettings.nav_items.length <= 1}
                  >
                    ×
                  </Button>
                </div>
              ))}
              {headerSettings.nav_items.length < 6 && (
                <Button variant="outline" onClick={addNavItem}>
                  + Add Navigation Item
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={saveHeaderSettings}
              disabled={!!saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving === "header" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : saveStatus.header === "success" ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving === "header"
                ? "Saving..."
                : saveStatus.header === "success"
                ? "Saved!"
                : "Save Header Settings"}
            </Button>
          </div>
        </TabsContent>

        {/* Footer Settings Tab */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Information</CardTitle>
              <CardDescription>
                Company description and copyright text in footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-desc">Company Description</Label>
                <Textarea
                  id="footer-desc"
                  value={footerSettings.company_description}
                  onChange={(e) =>
                    setFooterSettings((prev) => ({
                      ...prev,
                      company_description: e.target.value,
                    }))
                  }
                  placeholder="Company description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyright-text">Copyright Text</Label>
                <Input
                  id="copyright-text"
                  value={footerSettings.copyright_text}
                  onChange={(e) =>
                    setFooterSettings((prev) => ({
                      ...prev,
                      copyright_text: e.target.value,
                    }))
                  }
                  placeholder="© 2024 Mark Corpotax..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>
                Contact information matching the main sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Finance Support Phone</Label>
                  <Input
                    value={footerSettings.phone_finance}
                    onChange={(e) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        phone_finance: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Taxation Support Phone</Label>
                  <Input
                    value={footerSettings.phone_taxation}
                    onChange={(e) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        phone_taxation: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={footerSettings.email}
                    onChange={(e) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Headquarters Address</Label>
                  <Input
                    value={footerSettings.address}
                    onChange={(e) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={saveFooterSettings}
              disabled={!!saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving === "footer" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : saveStatus.footer === "success" ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving === "footer"
                ? "Saving..."
                : saveStatus.footer === "success"
                ? "Saved!"
                : "Save Footer Settings"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
