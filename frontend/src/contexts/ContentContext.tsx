"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { contentService } from "@/lib/content-service";

// Types for all page content
interface HomePageContent {
  hero_main?: any;
  about?: any;
  process?: any;
  cta?: any;
  team?: any;
  testimonials?: any;
  blog?: any;
}

interface ServicesPageContent {
  services_list?: any;
}

interface ContentState {
  home: HomePageContent;
  services: ServicesPageContent;
  general: any;
}

interface ContentContextType {
  content: ContentState;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  refreshContent: (page?: string) => Promise<void>;
  getSection: (page: string, section: string) => any;
}

const defaultContent: ContentState = {
  home: {},
  services: {},
  general: {},
};

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  isLoading: true,
  isInitialized: false,
  error: null,
  refreshContent: async () => {},
  getSection: () => null,
});

// Static fallback content for immediate render
const FALLBACK_CONTENT: ContentState = {
  home: {
    hero_main: {
      tagline: "MARK GROUP",
      title: "Shaping Financial Success in the AI Era",
      description:
        "Comprehensive financial and legal solutions for MSME financing, working capital, and taxation services. Trusted by 2500+ clients since 2012.",
      cta_primary: { text: "Get Started", link: "/appointment" },
      phone: { number: "+91 97120 67891", help_text: "Need help?" },
    },
    about: {
      about_section: {
        tagline: "About Us",
        title: "Your Trusted Financial Partner Since 2012",
        description:
          "Founded in Surat, Gujarat, MARK GROUP is dedicated to delivering comprehensive financial and legal solutions.",
        highlights: [
          "Expert team with decades of experience",
          "Transparent and ethical practices",
          "Personalized financial solutions",
          "Trusted by 2500+ satisfied clients",
        ],
        stats: [
          { value: "12+", label: "Years Experience", icon: "Award" },
          { value: "2500+", label: "Happy Clients", icon: "Users" },
          { value: "5000+", label: "Projects Done", icon: "TrendingUp" },
          { value: "100%", label: "Client Satisfaction", icon: "Shield" },
        ],
      },
    },
    process: {
      process_section: {
        tagline: "Our Process",
        title: "How We Work",
        process_steps: [
          {
            title: "Consultation",
            description: "Initial meeting to understand your needs",
            icon: "FileText",
          },
          {
            title: "Analysis",
            description: "Detailed review of your financial situation",
            icon: "Briefcase",
          },
          {
            title: "Strategy",
            description: "Custom solution tailored for you",
            icon: "CheckCircle",
          },
          {
            title: "Execution",
            description: "Seamless implementation and support",
            icon: "Users",
          },
        ],
      },
    },
  },
  services: {
    services_list: {
      services_list: [
        {
          title: "MSME Machinery Loan",
          description: "Get financing for machinery and equipment",
          icon: "Building2",
          slug: "msme-loan",
        },
        {
          title: "Working Capital Finance",
          description: "Flexible working capital solutions",
          icon: "HandCoins",
          slug: "working-capital",
        },
        {
          title: "Project Finance",
          description: "Complete project financing solutions",
          icon: "Briefcase",
          slug: "project-finance",
        },
      ],
    },
  },
  general: {},
};

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(FALLBACK_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all content in parallel
  const fetchAllContent = useCallback(async () => {
    try {
      setError(null);

      // Fetch home and services pages in parallel
      const [homeContent, servicesContent] = await Promise.all([
        contentService.getPageContent("home").catch(() => ({})),
        contentService.getPageContent("services").catch(() => ({})),
      ]);

      setContent((prev) => ({
        ...prev,
        home: { ...FALLBACK_CONTENT.home, ...homeContent },
        services: { ...FALLBACK_CONTENT.services, ...servicesContent },
      }));

      setIsInitialized(true);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content");
      // Keep fallback content on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh specific page or all content
  const refreshContent = useCallback(
    async (page?: string) => {
      try {
        setError(null);

        if (page) {
          contentService.clearCacheItem(page);
          const pageContent = await contentService.getPageContent(page);
          setContent((prev) => ({
            ...prev,
            [page]: pageContent,
          }));
        } else {
          contentService.clearCache();
          await fetchAllContent();
        }
      } catch (err) {
        console.error("Error refreshing content:", err);
        setError("Failed to refresh content");
      }
    },
    [fetchAllContent]
  );

  // Get section with fallback
  const getSection = useCallback(
    (page: string, section: string): any => {
      const pageContent = content[page as keyof ContentState];
      if (pageContent && typeof pageContent === "object") {
        return (
          (pageContent as any)[section] ||
          FALLBACK_CONTENT[page as keyof ContentState]?.[
            section as keyof typeof FALLBACK_CONTENT.home
          ] ||
          null
        );
      }
      return (
        FALLBACK_CONTENT[page as keyof ContentState]?.[
          section as keyof typeof FALLBACK_CONTENT.home
        ] || null
      );
    },
    [content]
  );

  // Initial fetch
  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const value = useMemo(
    () => ({
      content,
      isLoading,
      isInitialized,
      error,
      refreshContent,
      getSection,
    }),
    [content, isLoading, isInitialized, error, refreshContent, getSection]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}

// Hook for specific section with fallback
export function useSection(page: string, section: string) {
  const { getSection, isLoading, isInitialized } = useContent();

  const sectionContent = useMemo(() => {
    return getSection(page, section);
  }, [getSection, page, section]);

  return {
    content: sectionContent,
    isLoading: isLoading && !isInitialized,
    isReady: isInitialized || sectionContent !== null,
  };
}
