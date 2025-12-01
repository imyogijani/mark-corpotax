import express from "express";
import { Request, Response } from "express";
import { PageContentService } from "../services/firebaseService";

const router = express.Router();

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

// @desc    Get page content for frontend
// @route   GET /api/content/:page
// @access  Public
router.get("/:page", async (req: Request, res: Response) => {
  try {
    const { page } = req.params;

    const content = await PageContentService.findByFilter({
      page,
      isActive: true,
    });

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
        item.value
      );
    });

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

export default router;
