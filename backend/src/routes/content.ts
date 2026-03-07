import express from "express";
import { Request, Response } from "express";
import { PageContentService } from "../services/firebaseService";

const router = express.Router();

// In-memory cache for grouped content (reduces processing overhead)
interface ContentCache {
  data: any;
  timestamp: number;
}
const contentCache: { [key: string]: ContentCache } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to set nested value from dot-notation key
const setNestedValue = (obj: any, key: string, value: any): void => {
  const keys = key.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
};

// Clear content cache (called when content is updated)
export const clearContentCache = (page?: string): void => {
  if (page) {
    delete contentCache[`page-${page}`];
  } else {
    Object.keys(contentCache).forEach((key) => delete contentCache[key]);
  }
};

// @desc    Clear content cache (for admin use after updates)
// @route   POST /api/content/clear-cache
// @access  Admin only (should be protected)
// NOTE: This must be defined BEFORE the /:page route to avoid route conflicts
router.post("/clear-cache", async (req: Request, res: Response) => {
  try {
    const { page } = req.body;
    clearContentCache(page);

    // Also clear the PageContentService cache
    PageContentService.clearCache();

    res.status(200).json({
      success: true,
      message: page
        ? `Cache cleared for page: ${page}`
        : "All content cache cleared",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error clearing cache",
    });
  }
});

// @desc    Get all active content
// @route   GET /api/content
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const content = await PageContentService.findByFilter({ isActive: true });

    // Sort by page and section
    content.sort((a, b) => {
      if (a.page !== b.page) return a.page.localeCompare(b.page);
      return a.section.localeCompare(b.section);
    });

    // Group content by page and section with nested key support
    const groupedContent: any = {};
    content.forEach((item) => {
      if (!groupedContent[item.page]) {
        groupedContent[item.page] = {};
      }
      if (!groupedContent[item.page][item.section]) {
        groupedContent[item.page][item.section] = {};
      }
      // Convert dot-notation keys to nested structure
      setNestedValue(
        groupedContent[item.page][item.section],
        item.key,
        item.value,
      );
    });

    // Update cache for all content
    contentCache["all-content"] = {
      data: groupedContent,
      timestamp: Date.now(),
    };

    // Set cache headers
    // Using no-cache to force browser to revalidate with server
    // Server has its own memory cache which is fast enough
    res.set("Cache-Control", "no-cache");

    res.status(200).json({
      success: true,
      message: "All content retrieved successfully",
      data: groupedContent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving content",
    });
  }
});

// @desc    Get page content for frontend
// @route   GET /api/content/:page
// @access  Public
router.get("/:page", async (req: Request, res: Response): Promise<void> => {
  try {
    const { page } = req.params;
    const division = req.query.division as string;
    const cacheKey = division ? `page-${page}-${division}` : `page-${page}`;
    const skipCache = req.query.nocache === "true";

    // Check cache first (unless skipCache is true)
    if (
      !skipCache &&
      contentCache[cacheKey] &&
      Date.now() - contentCache[cacheKey].timestamp < CACHE_TTL
    ) {
      // Set cache headers for CDN/browser caching
      // use no-cache so browser always checks with server (which uses memory cache)
      res.set("Cache-Control", "no-cache");
      res.status(200).json({
        success: true,
        message: `${page} ${division || ""} content retrieved successfully (cached)`,
        data: contentCache[cacheKey].data,
      });
      return;
    }

    // Fetch all active content for this page
    // We fetch everything and filter in memory to handle the logic of (specific division + global)
    let content = await PageContentService.findByFilter({
      page,
      isActive: true,
    });

    // Filter by division if specified
    if (division) {
      content = content.filter(
        (item) =>
          item.division === division ||
          item.division === "global" ||
          !item.division,
      );
    }

    // Sort by section and key
    content.sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.key.localeCompare(b.key);
    });

    // Group content by section and convert dot-notation keys to nested objects
    const groupedContent: any = {};
    content.forEach((item) => {
      if (!groupedContent[item.section]) {
        groupedContent[item.section] = {};
      }
      // Convert dot-notation keys to nested structure
      setNestedValue(groupedContent[item.section], item.key, item.value);
    });

    // Update cache
    contentCache[cacheKey] = {
      data: groupedContent,
      timestamp: Date.now(),
    };

    // Set cache headers - Disable browser caching to ensure fresh content
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.status(200).json({
      success: true,
      message: `${page} content retrieved successfully`,
      data: groupedContent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving content",
    });
  }
});

export default router;
