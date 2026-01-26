"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PAGE_CONFIGS, PageConfig, SectionConfig, FieldConfig } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Info,
  Phone,
  Settings,
  Save,
  ChevronRight,
  ChevronLeft,
  X,
  Type,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  DollarSign,
  Users,
  BarChart,
  Star,
  Clock,
  Check,
  AlertCircle,
  Loader2,
  Layout,
  Layers,
  Monitor,
  Smartphone,
  RefreshCw,
  Trash2,
  ExternalLink,
  Plus,
  Edit,
  Eye,
} from "lucide-react";
import { contentService } from "@/lib/content-service";
import { authFetch } from "@/lib/auth";

interface SectionData {
  [key: string]: string | SectionData;
}

interface ContentData {
  [section: string]: SectionData;
}

// Helper to get nested value from object
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return "";
    current = (current as Record<string, unknown>)[key];
  }
  return (current as string) || "";
};

// Helper to set nested value in object
const setNestedValue = (
  obj: Record<string, unknown>,
  path: string,
  value: string,
): void => {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
};

export function SiteEditor() {
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [contentData, setContentData] = useState<ContentData>({});
  const [originalData, setOriginalData] = useState<ContentData>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [clearingCache, setClearingCache] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    [key: string]: "saved" | "error" | null;
  }>({});
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const currentPageConfig =
    PAGE_CONFIGS.find((p) => p.id === selectedPage) || PAGE_CONFIGS[0];

  const getPageUrl = () => {
    const pageUrls: Record<string, string> = {
      home: "/",
      about: "/about",
      contact: "/contact",
      services: "/services",
      blog: "/blog",
      appointment: "/appointment",
      settings: "/",
    };
    return pageUrls[selectedPage] || "/";
  };

  // Fetch blog posts for Blog page
  const fetchBlogPosts = useCallback(async () => {
    if (selectedPage !== "blog") return;
    setLoadingBlogs(true);
    try {
      const API_BASE =
        typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/blog`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns { data: { blogs: [...], pagination: {...} } }
        const blogs = data.data?.blogs || data.data || [];
        setBlogPosts(Array.isArray(blogs) ? blogs : []);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoadingBlogs(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    if (selectedPage === "blog" && selectedSection === "posts") {
      fetchBlogPosts();
    }
  }, [selectedPage, selectedSection, fetchBlogPosts]);

  // Helper to expand arrays into individual keys for editing
  // e.g., highlights: ["a", "b"] -> highlight_1: "a", highlight_2: "b"
  const expandArraysToKeys = (data: ContentData): ContentData => {
    const expanded = JSON.parse(JSON.stringify(data));

    // Process each section
    for (const sectionKey of Object.keys(expanded)) {
      const section = expanded[sectionKey];
      if (!section || typeof section !== "object") continue;

      // Look for nested section data (e.g., about_section within about)
      for (const key of Object.keys(section)) {
        const value = section[key];
        if (!value || typeof value !== "object") continue;

        // Expand highlights array
        if (Array.isArray(value.highlights)) {
          value.highlights.forEach((item: string, index: number) => {
            value[`highlight_${index + 1}`] = item;
          });
        }

        // Expand stats array
        if (Array.isArray(value.stats)) {
          value.stats.forEach(
            (
              stat: { value?: string; label?: string; icon?: string },
              index: number,
            ) => {
              if (stat.value) value[`stat_${index + 1}_value`] = stat.value;
              if (stat.label) value[`stat_${index + 1}_label`] = stat.label;
              if (stat.icon) value[`stat_${index + 1}_icon`] = stat.icon;
            },
          );
        }

        // Expand process_steps array
        if (Array.isArray(value.process_steps)) {
          value.process_steps.forEach(
            (
              step: { title?: string; description?: string; icon?: string },
              index: number,
            ) => {
              if (step.title) value[`step_${index + 1}_title`] = step.title;
              if (step.description)
                value[`step_${index + 1}_description`] = step.description;
              if (step.icon) value[`step_${index + 1}_icon`] = step.icon;
            },
          );
        }

        // Expand testimonials array
        if (Array.isArray(value.testimonials)) {
          value.testimonials.forEach(
            (
              t: {
                quote?: string;
                content?: string;
                name?: string;
                title?: string;
                rating?: number;
              },
              index: number,
            ) => {
              if (t.quote || t.content)
                value[`testimonial_${index + 1}_quote`] = t.quote || t.content;
              if (t.name) value[`testimonial_${index + 1}_name`] = t.name;
              if (t.title) value[`testimonial_${index + 1}_title`] = t.title;
            },
          );
        }

        // Expand team_members array
        if (Array.isArray(value.team_members)) {
          value.team_members.forEach(
            (member: { name?: string; title?: string }, index: number) => {
              if (member.name) value[`member_${index + 1}_name`] = member.name;
              if (member.title)
                value[`member_${index + 1}_title`] = member.title;
            },
          );
        }
      }
    }

    return expanded;
  };

  const loadPageContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/content/${selectedPage}`);
      if (response.success && response.data) {
        // Expand arrays to individual keys for editing
        const expandedData = expandArraysToKeys(response.data as ContentData);
        setContentData(expandedData);
        setOriginalData(JSON.parse(JSON.stringify(expandedData)));
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    loadPageContent();
    setSelectedSection(null);
  }, [loadPageContent]);

  const handleFieldChange = (
    sectionKey: string,
    fieldKey: string,
    value: string,
  ) => {
    setContentData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData[sectionKey]) {
        newData[sectionKey] = {};
      }
      setNestedValue(
        newData[sectionKey] as Record<string, unknown>,
        fieldKey,
        value,
      );
      return newData;
    });
    setSaveStatus((prev) => ({ ...prev, [sectionKey]: null }));
  };

  const saveSection = async (sectionKey: string) => {
    setSaving(sectionKey);
    try {
      const sectionData = contentData[sectionKey] || {};

      const flattenData = (
        obj: SectionData,
        prefix = "",
      ): Record<string, string> => {
        const result: Record<string, string> = {};
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            Object.assign(result, flattenData(value as SectionData, fullKey));
          } else {
            result[fullKey] = value as string;
          }
        }
        return result;
      };

      const flatData = flattenData(sectionData);

      const promises = Object.entries(flatData).map(([key, value]) =>
        authFetch("/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: selectedPage,
            section: sectionKey,
            key,
            value,
          }),
        }),
      );

      await Promise.all(promises);

      // Clear backend cache explicitly
      await authFetch("/content/clear-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: selectedPage }),
      });

      // Clear frontend cache
      contentService.clearCache();

      // Set flag for other tabs/pages to know content was updated
      localStorage.setItem("content_updated", Date.now().toString());

      setSaveStatus((prev) => ({ ...prev, [sectionKey]: "saved" }));
      setOriginalData((prev) => ({
        ...prev,
        [sectionKey]: JSON.parse(JSON.stringify(contentData[sectionKey])),
      }));
      refreshPreview();

      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [sectionKey]: null }));
      }, 3000);
    } catch (error) {
      console.error("Failed to save:", error);
      setSaveStatus((prev) => ({ ...prev, [sectionKey]: "error" }));
    } finally {
      setSaving(null);
    }
  };

  const saveAllSections = async () => {
    for (const section of currentPageConfig.sections) {
      if (hasChanges(section.id)) {
        await saveSection(section.id);
      }
    }
  };

  const clearAllCache = async () => {
    setClearingCache(true);
    try {
      // Clear backend cache
      await authFetch("/content/clear-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      // Clear frontend cache
      contentService.clearCache();

      // Set flag for other pages
      localStorage.setItem("content_updated", Date.now().toString());

      setPreviewKey((prev) => prev + 1);
      await loadPageContent();
    } finally {
      setClearingCache(false);
    }
  };

  const refreshPreview = () => {
    setPreviewKey(Date.now());
  };

  const hasChanges = (sectionKey: string): boolean => {
    return (
      JSON.stringify(contentData[sectionKey]) !==
      JSON.stringify(originalData[sectionKey])
    );
  };

  const hasAnyChanges = (): boolean => {
    return currentPageConfig.sections.some((s) => hasChanges(s.id));
  };

  const getPageIcon = (pageKey: string) => {
    const icons: Record<string, React.ReactNode> = {
      home: <Home className="h-4 w-4" />,
      about: <Info className="h-4 w-4" />,
      contact: <Phone className="h-4 w-4" />,
      services: <Layers className="h-4 w-4" />,
      settings: <Settings className="h-4 w-4" />,
    };
    return icons[pageKey] || <FileText className="h-4 w-4" />;
  };

  const getSectionIcon = (sectionKey: string) => {
    const icons: Record<string, React.ReactNode> = {
      hero: <Layout className="h-4 w-4" />,
      hero_main: <Layout className="h-4 w-4" />,
      features: <Star className="h-4 w-4" />,
      process: <Star className="h-4 w-4" />,
      services: <Layers className="h-4 w-4" />,
      services_preview: <Layers className="h-4 w-4" />,
      services_intro: <Layers className="h-4 w-4" />,
      stats: <BarChart className="h-4 w-4" />,
      about: <Info className="h-4 w-4" />,
      about_section: <Info className="h-4 w-4" />,
      testimonials: <MessageSquare className="h-4 w-4" />,
      cta: <DollarSign className="h-4 w-4" />,
      cta_section: <DollarSign className="h-4 w-4" />,
      mission: <Globe className="h-4 w-4" />,
      team: <Users className="h-4 w-4" />,
      header: <Type className="h-4 w-4" />,
      contact: <Mail className="h-4 w-4" />,
      contact_info: <Mail className="h-4 w-4" />,
      social: <Globe className="h-4 w-4" />,
      hours: <Clock className="h-4 w-4" />,
      working_hours: <Clock className="h-4 w-4" />,
      address: <MapPin className="h-4 w-4" />,
      company: <Globe className="h-4 w-4" />,
      footer: <Layout className="h-4 w-4" />,
      navigation: <Layers className="h-4 w-4" />,
      footer_links: <ExternalLink className="h-4 w-4" />,
      footer_services: <Layers className="h-4 w-4" />,
    };
    return icons[sectionKey] || <FileText className="h-4 w-4" />;
  };

  const renderFieldEditor = (field: FieldConfig, sectionKey: string) => {
    const sectionData =
      (contentData[sectionKey] as Record<string, unknown>) || {};
    const value = getNestedValue(sectionData, field.key);

    return (
      <div key={field.key} className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {field.label}
        </label>
        {field.type === "textarea" || field.type === "richtext" ? (
          <Textarea
            value={value}
            onChange={(e) =>
              handleFieldChange(sectionKey, field.key, e.target.value)
            }
            placeholder={field.placeholder}
            className="min-h-[100px] resize-none text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          />
        ) : field.type === "image" ? (
          <div className="space-y-2">
            <Input
              value={value}
              onChange={(e) =>
                handleFieldChange(sectionKey, field.key, e.target.value)
              }
              placeholder={field.placeholder || "Enter image URL"}
              className="text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
            {value && (
              <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <Input
            value={value}
            onChange={(e) =>
              handleFieldChange(sectionKey, field.key, e.target.value)
            }
            placeholder={field.placeholder}
            className="text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          />
        )}
      </div>
    );
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      default:
        return "w-full";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left Panel - Navigation */}
      <div className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-xl">
        {/* Back to Admin Button */}
        <Link href="/admin" className="block">
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all duration-200 group">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium">Back to Admin Panel</span>
            </div>
          </div>
        </Link>

        {/* Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Page Editor
              </h2>
              <p className="text-xs text-slate-500">Edit & Preview Live</p>
            </div>
          </div>
        </div>

        {/* Pages List */}
        <div className="p-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Pages
          </p>
          <div className="space-y-1">
            {PAGE_CONFIGS.map((config: PageConfig) => (
              <button
                key={config.id}
                onClick={() => setSelectedPage(config.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                  selectedPage === config.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-md"
                }`}
              >
                <span
                  className={`${
                    selectedPage === config.id ? "text-white" : "text-slate-400"
                  }`}
                >
                  {getPageIcon(config.id)}
                </span>
                <span className="flex-1 text-sm font-medium">
                  {config.name}
                </span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] h-5 ${
                    selectedPage === config.id
                      ? "bg-white/20 text-white border-0"
                      : "bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  }`}
                >
                  {config.sections.length}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <Separator className="mx-3 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

        {/* Sections List */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-3 pb-0">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Sections
            </p>
          </div>
          <ScrollArea className="flex-1 px-3 pb-3" data-lenis-prevent>
            <div className="space-y-1">
              {currentPageConfig.sections.map((section: SectionConfig) => {
                const isSelected = selectedSection === section.id;
                const changed = hasChanges(section.id);
                const status = saveStatus[section.id];

                return (
                  <button
                    key={section.id}
                    onClick={() =>
                      setSelectedSection(isSelected ? null : section.id)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 group ${
                      isSelected
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-[1.02]"
                        : "hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-md hover:scale-[1.01]"
                    } ${
                      changed && !isSelected
                        ? "border-l-3 border-l-amber-500"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-all duration-300 ${
                        isSelected
                          ? "bg-white/20 text-white shadow-inner"
                          : "bg-slate-100/80 dark:bg-slate-700/80 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"
                      }`}
                    >
                      {getSectionIcon(section.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isSelected
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900"
                        }`}
                      >
                        {section.name}
                      </p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? "text-white/70" : "text-slate-400"
                        }`}
                      >
                        {section.fields.length} fields
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {changed && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSelected
                              ? "bg-white/80 animate-pulse"
                              : "bg-amber-500"
                          }`}
                        />
                      )}
                      {status === "saved" && (
                        <Check
                          className={`h-3.5 w-3.5 ${
                            isSelected ? "text-white" : "text-blue-500"
                          }`}
                        />
                      )}
                      {status === "error" && (
                        <AlertCircle
                          className={`h-3.5 w-3.5 ${
                            isSelected ? "text-white" : "text-red-500"
                          }`}
                        />
                      )}
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isSelected
                            ? "rotate-90 text-white/80"
                            : "text-slate-300 group-hover:text-violet-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm">
          <Button
            onClick={saveAllSections}
            disabled={saving !== null || !hasAnyChanges()}
            className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={clearAllCache}
            disabled={clearingCache}
            className="w-full h-9 text-slate-600 border-slate-200/50 hover:bg-white/50 hover:shadow-md backdrop-blur-sm transition-all"
          >
            {clearingCache ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cache
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              {getPageIcon(selectedPage)}
              <span className="font-medium text-sm">
                {currentPageConfig.name}
              </span>
            </div>
            {selectedSection && (
              <>
                <ChevronRight className="h-4 w-4 text-slate-300" />
                <span className="text-sm text-slate-500">
                  {
                    currentPageConfig.sections.find(
                      (s) => s.id === selectedSection,
                    )?.name
                  }
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setPreviewMode("desktop")}
                title="Desktop preview"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  previewMode === "desktop"
                    ? "bg-white dark:bg-slate-700 shadow-md text-violet-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                title="Tablet preview"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  previewMode === "tablet"
                    ? "bg-white dark:bg-slate-700 shadow-md text-violet-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                title="Mobile preview"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  previewMode === "mobile"
                    ? "bg-white dark:bg-slate-700 shadow-md text-violet-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200/50 dark:bg-slate-700/50" />

            <Button
              variant="ghost"
              size="icon"
              onClick={refreshPreview}
              className="h-9 w-9 hover:bg-slate-100/80 hover:shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(getPageUrl(), "_blank")}
              className="h-9 w-9 hover:bg-slate-100/80 hover:shadow-md transition-all"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          {selectedSection && (
            <div className="w-[380px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-2xl">
              {/* Editor Header */}
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                      {getSectionIcon(selectedSection)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {
                          currentPageConfig.sections.find(
                            (s) => s.id === selectedSection,
                          )?.name
                        }
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedSection === "posts"
                          ? `${blogPosts.length} blog posts`
                          : `${
                              currentPageConfig.sections.find(
                                (s) => s.id === selectedSection,
                              )?.fields.length
                            } editable fields`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedSection(null)}
                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Editor Fields or Blog Posts Panel */}
              <ScrollArea className="flex-1" data-lenis-prevent>
                {selectedSection === "posts" && selectedPage === "blog" ? (
                  /* Blog Posts Management Panel */
                  <div className="p-4 space-y-4">
                    <Link href="/admin/blog/new">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Post
                      </Button>
                    </Link>

                    {loadingBlogs ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : blogPosts.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No blog posts yet</p>
                        <p className="text-xs mt-1">
                          Create your first post to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-medium">
                          Posts shown on blog page:
                        </p>
                        {blogPosts.slice(0, 10).map((post: any) => (
                          <div
                            key={post._id}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate text-slate-900 dark:text-white">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    variant={
                                      post.status === "published"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-[10px] h-5"
                                  >
                                    {post.status}
                                  </Badge>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(
                                      post.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Link href={`/admin/blog/new?edit=${post._id}`}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </Link>
                                {post.status === "published" && (
                                  <Link
                                    href={`/blog/${post._id}`}
                                    target="_blank"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {blogPosts.length > 10 && (
                          <p className="text-xs text-center text-slate-400">
                            +{blogPosts.length - 10} more posts
                          </p>
                        )}
                      </div>
                    )}

                    <Separator />

                    <Link href="/admin/blog" className="block">
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage All Posts
                      </Button>
                    </Link>
                  </div>
                ) : (
                  /* Regular Fields Editor */
                  <div className="p-4 space-y-5">
                    {currentPageConfig.sections
                      .find((s) => s.id === selectedSection)
                      ?.fields.map((field: FieldConfig) =>
                        renderFieldEditor(field, selectedSection),
                      )}
                  </div>
                )}
              </ScrollArea>

              {/* Editor Footer - only show for non-posts sections */}
              {selectedSection !== "posts" && (
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
                  <Button
                    onClick={() => saveSection(selectedSection)}
                    disabled={
                      saving === selectedSection || !hasChanges(selectedSection)
                    }
                    className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl"
                  >
                    {saving === selectedSection ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Section
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Preview Area */}
          <div className="flex-1 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-auto">
            <div className="min-h-full p-6 flex justify-center">
              <div
                className={`${getPreviewWidth()} transition-all duration-300 ${
                  previewMode !== "desktop" ? "max-w-full" : ""
                }`}
              >
                <div
                  className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 ring-1 ring-black/5 ${
                    previewMode === "mobile"
                      ? "h-[700px]"
                      : previewMode === "tablet"
                        ? "h-[900px]"
                        : "min-h-[calc(100vh-180px)]"
                  }`}
                >
                  {loading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-slate-500">
                        Loading preview...
                      </p>
                    </div>
                  ) : (
                    <iframe
                      key={previewKey}
                      ref={iframeRef}
                      src={`${getPageUrl()}?_t=${previewKey}`}
                      className="w-full h-full border-0"
                      title="Page Preview"
                      style={{
                        minHeight:
                          previewMode === "desktop"
                            ? "calc(100vh - 180px)"
                            : undefined,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteEditor;
