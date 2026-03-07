import { apiClient } from "@/lib/api-client";

interface ContentCache {
  [key: string]: {
    data: any;
    timestamp: number;
    version: number;
  };
}

// Global cache version - incremented on every cache invalidation
let cacheVersion = 0;

// Get stored cache version from localStorage
const getStoredCacheVersion = (): number => {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("content_cache_version");
  return stored ? parseInt(stored, 10) : 0;
};

// Store cache version to localStorage
const storeCacheVersion = (version: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("content_cache_version", version.toString());
};

// Event for cache invalidation (components can listen to this)
const CACHE_INVALIDATION_EVENT = "content-cache-invalidated";

class ContentService {
  private cache: ContentCache = {};
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes cache for production
  private shortCacheTimeout = 30 * 1000; // 30 seconds for development
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === "undefined") return;
    if (this.initialized) return;
    this.initialized = true;

    // Check localStorage for cache version on init
    const storedVersion = getStoredCacheVersion();
    if (storedVersion > cacheVersion) {
      // Another tab updated the cache version, sync it
      cacheVersion = storedVersion;
    }

    // Check if there's a content_updated flag (legacy support)
    const contentUpdated = localStorage.getItem("content_updated");
    if (contentUpdated) {
      localStorage.removeItem("content_updated");
      this.clearCache();
    }

    // Listen for storage events from other tabs
    window.addEventListener("storage", (e: StorageEvent) => {
      if (e.key === "content_cache_version" && e.newValue) {
        const newVersion = parseInt(e.newValue, 10);
        if (newVersion > cacheVersion) {
          cacheVersion = newVersion;
          this.cache = {}; // Clear local cache
          // Dispatch event so components can refresh
          window.dispatchEvent(new CustomEvent(CACHE_INVALIDATION_EVENT));
        }
      }
      // Legacy support
      if (e.key === "content_updated" && e.newValue) {
        this.clearCache();
      }
    });
  }

  private getCacheTimeout(): number {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      return this.shortCacheTimeout;
    }
    return this.cacheTimeout;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache[key];
    if (!cached) return false;
    // Check if cache version is current
    if (cached.version < cacheVersion) return false;
    // Check if cache has expired
    return Date.now() - cached.timestamp < this.getCacheTimeout();
  }

  private getDivision(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem("user_division") || undefined;
  }

  // Get full page content (cached) - optimized version
  private async getFullPageContent(page: string): Promise<any> {
    const division = this.getDivision();
    const cacheKey = division ? `page-${page}-${division}` : `page-${page}`;

    // Check URL for cache busting params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("_t") || params.has("nocache") || params.has("refresh")) {
        delete this.cache[cacheKey];
      }
    }

    // Check cache first
    if (this.cache[cacheKey] && this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data;
    }

    // Fetch fresh data
    try {
      // Pass division to API client
      const response = await apiClient.getPageContent(page, true, division);

      if (response.success && response.data) {
        // Store with current cache version
        this.cache[cacheKey] = {
          data: response.data,
          timestamp: Date.now(),
          version: cacheVersion,
        };
        return response.data;
      }
      return {};
    } catch (error) {
      console.error("Error fetching page content:", error);
      return {};
    }
  }

  // Generic method to get content by page and key
  async getContent(page: string, key?: string): Promise<any> {
    try {
      const pageContent = await this.getFullPageContent(page);

      if (key) {
        return pageContent[key] || this.getFallbackContent(page, key);
      }
      return pageContent || this.getFallbackContent(page, key);
    } catch (error) {
      console.error("Error fetching content:", error);
      return this.getFallbackContent(page, key);
    }
  }

  // Get hero section content
  async getHeroContent() {
    const content = await this.getContent("home", "hero_main");
    return (
      content || {
        title: "Expert Financial Solutions for Your Business Growth",
        tagline: "Shaping Financial Success in the AI Era",
        description:
          "Founded in 2012 in Surat, Gujarat, MARK GROUP is dedicated to delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.",
        cta_primary: { text: "Get Started", link: "/appointment" },
        cta_secondary: { text: "Learn More", link: "/about" },
      }
    );
  }

  // Get company info
  async getCompanyInfo() {
    const content = await this.getContent("general", "company");
    return (
      content || {
        name: "MARK GROUP",
        tagline: "Shaping Financial Success in the AI Era",
        founded: "2012",
        location: "Surat, Gujarat",
        email: "markcorpotax@gmail.com",
        phone: {
          finance: "97120 67891/92",
          taxation: "97738 22604",
        },
        address:
          "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003",
      }
    );
  }

  // Get services content
  async getServicesContent() {
    const content = await this.getContent("home", "services");
    return (
      content || {
        title: "Our Financial Services",
        description:
          "Comprehensive financial solutions tailored to your business needs",
        services: [
          {
            title: "MSME Machinery Loan",
            description:
              "Get financing for machinery and equipment with government subsidy benefits",
            icon: "Building2",
          },
          {
            title: "Working Capital Finance",
            description:
              "Flexible working capital solutions to manage your business operations",
            icon: "HandCoins",
          },
          {
            title: "Project Finance",
            description:
              "Complete project financing solutions for your business expansion",
            icon: "Briefcase",
          },
        ],
      }
    );
  }

  // Get testimonials
  async getTestimonials() {
    const content = await this.getContent("home", "testimonials");
    return (
      content || [
        {
          quote:
            "MARK GROUP has been instrumental in my business growth. Their personalized approach and expert financial solutions have made all the difference.",
          name: "Alex Johnson",
          title: "CEO, Tech Innovators",
        },
        {
          quote:
            "The team at MARK GROUP is incredibly knowledgeable and supportive. I feel confident knowing my business financing is in good hands.",
          name: "Sarah Lee",
          title: "Founder, Creative Solutions",
        },
      ]
    );
  }

  // Get about page content
  async getAboutContent() {
    const content = await this.getContent("about");
    return (
      content || {
        title: "About MARK GROUP",
        mission:
          "Our mission is to empower businesses to achieve their growth ambitions by providing expert, client-focused loan consultancy and financial solutions.",
        vision:
          "To be the most trusted partner in providing innovative loan consultancy and financial solutions, enabling businesses across industries to access funding, achieve expansion, and unlock sustainable growth.",
        description:
          "Founded in 2012 in Surat, Gujarat, MARK GROUP is dedicated to delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.",
      }
    );
  }

  private getFallbackContent(page: string, key?: string): any {
    // Fallback content when API is unavailable
    const fallbacks: { [key: string]: any } = {
      "home-hero_main": {
        title: "Expert Financial Solutions for Your Business Growth",
        tagline: "Shaping Financial Success in the AI Era",
        description:
          "Founded in 2012 in Surat, Gujarat, MARK GROUP is dedicated to delivering comprehensive financial and legal solutions.",
        cta_primary: { text: "Get Started", link: "/appointment" },
        cta_secondary: { text: "Learn More", link: "/about" },
      },
      "general-company": {
        name: "MARK GROUP",
        tagline: "Shaping Financial Success in the AI Era",
        founded: "2012",
        location: "Surat, Gujarat",
      },
    };

    const fallbackKey = key ? `${page}-${key}` : page;
    return fallbacks[fallbackKey] || null;
  }

  // Clear cache and increment version (useful for admin updates)
  clearCache() {
    // Increment global cache version
    cacheVersion++;
    // Store to localStorage for cross-tab sync
    storeCacheVersion(cacheVersion);
    // Clear in-memory cache
    this.cache = {};
    // Dispatch event so components can refresh
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CACHE_INVALIDATION_EVENT));
    }
  }

  // Clear specific cache entry
  clearCacheItem(page: string, _key?: string) {
    const cacheKey = `page-${page}`;
    delete this.cache[cacheKey];
    // Increment version to invalidate any stale data
    cacheVersion++;
    storeCacheVersion(cacheVersion);
    // Dispatch event so components can refresh
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(CACHE_INVALIDATION_EVENT, { detail: { page } }),
      );
    }
  }

  // Subscribe to cache invalidation events
  onCacheInvalidated(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const handler = () => callback();
    window.addEventListener(CACHE_INVALIDATION_EVENT, handler);
    return () => window.removeEventListener(CACHE_INVALIDATION_EVENT, handler);
  }

  // Get content by page and section (uses cached full page response)
  async getContentBySection(page: string, section: string): Promise<any> {
    try {
      const pageContent = await this.getFullPageContent(page);
      return pageContent[section] || {};
    } catch (error) {
      console.error("Error fetching section content:", error);
      return {};
    }
  }

  // Public method to get full page content
  async getPageContent(page: string): Promise<any> {
    return this.getFullPageContent(page);
  }

  // Prefetch multiple pages at once - for faster initial load
  async prefetchPages(pages: string[]): Promise<void> {
    await Promise.all(
      pages.map((page) => this.getFullPageContent(page).catch(() => ({}))),
    );
  }

  // Warm up cache - call this on app init
  async warmUpCache(): Promise<void> {
    await this.prefetchPages(["home", "services", "about"]);
  }

  // Force refresh - clears cache and refetches
  async forceRefresh(page?: string): Promise<void> {
    this.clearCache();
    if (page) {
      await this.getFullPageContent(page);
    }
  }
}

// Export singleton instance
export const contentService = new ContentService();
