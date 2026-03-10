import express from "express";
import { Request, Response } from "express";
import {
  PageContentService,
  ContactService,
} from "../services/firebaseService";
import { AppointmentDatabaseService } from "../services/appointmentDatabase";
import { protect, authorize } from "../middleware/auth";
import { clearContentCache } from "./content";

// Use appointment database service (external or default) - only appointments use external DB
const AppointmentService = AppointmentDatabaseService;

const router = express.Router();

// Apply authentication to all admin routes
router.use(protect);
router.use(authorize("admin"));

// @desc    Get all page content
// @route   GET /api/admin/content
// @access  Private/Admin
router.get("/content", async (req: Request, res: Response) => {
  try {
    const { page, section, includeInactive } = req.query;

    const filter: any = {};
    if (page) filter.page = page as string;
    if (section) filter.section = section as string;

    // Only filter by isActive if includeInactive is not set to 'true'
    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    const content = await PageContentService.findByFilter(filter);

    // Sort by page and section
    content.sort((a, b) => {
      if (a.page !== b.page) return a.page.localeCompare(b.page);
      return a.section.localeCompare(b.section);
    });

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully",
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving content",
    });
  }
});

// @desc    Get content by page
// @route   GET /api/admin/content/:page
// @access  Private/Admin
router.get("/content/:page", async (req: Request, res: Response) => {
  try {
    const { page } = req.params;

    const content = await PageContentService.findByFilter({
      page,
      isActive: true,
    });

    // Sort by section
    content.sort((a, b) => a.section.localeCompare(b.section));

    res.status(200).json({
      success: true,
      message: `${page} page content retrieved successfully`,
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving page content",
    });
  }
});

// @desc    Create or update page content
// @route   POST /api/admin/content
// @access  Private/Admin
router.post("/content", async (req: Request, res: Response) => {
  try {
    const { page, section, type, key, value } = req.body;

    // Check if content already exists
    const existingContent = await PageContentService.findByFilter({
      page,
      section,
      key,
    });

    let content;
    if (existingContent.length > 0) {
      // Update existing content
      content = await PageContentService.update(existingContent[0].id!, {
        value,
        type,
      });
    } else {
      // Create new content
      content = await PageContentService.create({
        page,
        section,
        type,
        key,
        value,
      });
    }

    // Clear content cache for this page
    clearContentCache(page);
    PageContentService.clearCache();

    res.status(200).json({
      success: true,
      message: "Content saved successfully",
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error saving content",
    });
  }
});

// @desc    Update page content by page/section/key (upsert)
// @route   PUT /api/admin/content
// @access  Private/Admin
router.put("/content", async (req: Request, res: Response) => {
  try {
    const { page, section, key, value, type = "text" } = req.body;

    if (!page || !section || !key) {
      res.status(400).json({
        success: false,
        message: "page, section, and key are required",
      });
      return;
    }

    // Check if content already exists
    const existingContent = await PageContentService.findByFilter({
      page,
      section,
      key,
    });

    let content;
    if (existingContent.length > 0) {
      // Update existing content
      content = await PageContentService.update(existingContent[0].id!, {
        value,
        type,
      });
    } else {
      // Create new content
      content = await PageContentService.create({
        page,
        section,
        type,
        key,
        value,
        isActive: true,
      });
    }

    // Clear content cache for this page
    clearContentCache(page);
    PageContentService.clearCache();

    res.status(200).json({
      success: true,
      message: "Content saved successfully",
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error saving content",
    });
  }
});

// @desc    Update page content
// @route   PUT /api/admin/content/:id
// @access  Private/Admin
router.put("/content/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const content = await PageContentService.update(id, updateData);

    if (!content) {
      res.status(404).json({
        success: false,
        message: "Content not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error updating content",
    });
  }
});

// @desc    Delete page content
// @route   DELETE /api/admin/content/:id
// @access  Private/Admin
router.delete("/content/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const content = await PageContentService.findById(id);

    if (!content) {
      res.status(404).json({
        success: false,
        message: "Content not found",
      });
      return;
    }

    // Soft delete by setting isActive to false
    await PageContentService.update(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error deleting content",
    });
  }
});

// @desc    Bulk update content for a page
// @route   PUT /api/admin/content/bulk/:page
// @access  Private/Admin
router.put("/content/bulk/:page", async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const { content } = req.body; // Array of content objects

    const results: any[] = [];

    for (const item of content) {
      const { section, type, key, value } = item;

      const existingContent = await PageContentService.findByFilter({
        page,
        section,
        key,
      });

      let contentItem;
      if (existingContent.length > 0) {
        contentItem = await PageContentService.update(existingContent[0].id!, {
          value,
          type,
        });
      } else {
        contentItem = await PageContentService.create({
          page,
          section,
          type,
          key,
          value,
        });
      }

      results.push(contentItem);
    }

    res.status(200).json({
      success: true,
      message: "Bulk content update completed",
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error in bulk update",
    });
  }
});

// Get dashboard statistics
router.get("/dashboard-stats", async (req: Request, res: Response) => {
  try {
    // Get all data from Firebase
    const allContacts = await ContactService.findAll();
    const allPageContents = await PageContentService.findAll();
    const allAppointments = await AppointmentService.findAll();

    // Calculate counts
    const totalContacts = allContacts.length;
    const totalPageContents = allPageContents.length;
    const totalAppointments = allAppointments.length;
    const pendingContacts = allContacts.filter(
      (c) => c.status === "new"
    ).length;
    const pendingAppointments = allAppointments.filter(
      (a) => a.status === "pending"
    ).length;

    // Get recent contacts (last 5)
    const recentContacts = allContacts
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        status: c.status,
        createdAt: c.createdAt,
      }));

    // Get recent appointments (last 5)
    const recentAppointments = allAppointments
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        service: a.serviceName || "General Appointment",
        status: a.status,
        createdAt: a.createdAt,
      }));

    res.json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalContacts,
        totalAppointments,
        totalPageContents,
        pendingContacts,
        pendingAppointments,
        recentContacts,
        recentAppointments,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
