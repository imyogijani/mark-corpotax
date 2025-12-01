import express, { Request, Response } from "express";
import {
  BusinessService,
  ServiceService,
  SiteSettingsService,
} from "../services/firebaseService";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// ============================================
// PUBLIC ROUTES - For website visitors
// ============================================

// Get the linked business info for this website
router.get("/linked", async (req: Request, res: Response): Promise<void> => {
  try {
    const businessId = await SiteSettingsService.getLinkedBusinessId();

    if (!businessId) {
      res.status(404).json({
        success: false,
        message: "No business has been linked to this website yet",
      });
      return;
    }

    const business = await BusinessService.findById(businessId);

    if (!business) {
      res.status(404).json({
        success: false,
        message: "Linked business not found",
      });
      return;
    }

    res.json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Error getting linked business:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get business information",
    });
  }
});

// Get services for the linked business (public - for appointment booking)
router.get(
  "/linked/services",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const businessId = await SiteSettingsService.getLinkedBusinessId();

      if (!businessId) {
        res.status(404).json({
          success: false,
          message: "No business has been linked to this website",
        });
        return;
      }

      const services = await ServiceService.findByBusinessId(businessId);

      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      console.error("Error getting services:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get services",
      });
    }
  }
);

// ============================================
// ADMIN ROUTES - Protected
// ============================================

// Get all businesses (admin only - for linking)
router.get(
  "/all",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const businesses = await BusinessService.findAll();

      res.json({
        success: true,
        data: businesses,
      });
    } catch (error) {
      console.error("Error getting all businesses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get businesses",
      });
    }
  }
);

// Get a specific business by ID
router.get(
  "/:id",
  protect,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const business = await BusinessService.findById(id);

      if (!business) {
        res.status(404).json({
          success: false,
          message: "Business not found",
        });
        return;
      }

      res.json({
        success: true,
        data: business,
      });
    } catch (error) {
      console.error("Error getting business:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get business",
      });
    }
  }
);

// Get services for a specific business (admin)
router.get(
  "/:id/services",
  protect,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const services = await ServiceService.findByBusinessId(id);

      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      console.error("Error getting services:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get services",
      });
    }
  }
);

// Create a new business (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, email, phone, address, logoUrl } = req.body;

      if (!name) {
        res.status(400).json({
          success: false,
          message: "Business name is required",
        });
        return;
      }

      const business = await BusinessService.create({
        name,
        description: description || "",
        email: email || "",
        phone: phone || "",
        address: address || "",
        logoUrl: logoUrl || "",
        isActive: true,
      });

      res.status(201).json({
        success: true,
        message: "Business created successfully",
        data: business,
      });
    } catch (error) {
      console.error("Error creating business:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create business",
      });
    }
  }
);

// Update a business (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, email, phone, address, logoUrl, isActive } =
        req.body;

      const existing = await BusinessService.findById(id);
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Business not found",
        });
        return;
      }

      const business = await BusinessService.update(id, {
        name,
        description,
        email,
        phone,
        address,
        logoUrl,
        isActive,
      });

      res.json({
        success: true,
        message: "Business updated successfully",
        data: business,
      });
    } catch (error) {
      console.error("Error updating business:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update business",
      });
    }
  }
);

// Delete a business (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existing = await BusinessService.findById(id);
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Business not found",
        });
        return;
      }

      // Check if this is the linked business
      const linkedId = await SiteSettingsService.getLinkedBusinessId();
      if (linkedId === id) {
        await SiteSettingsService.set("linkedBusinessId", null);
      }

      await BusinessService.delete(id);

      res.json({
        success: true,
        message: "Business deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting business:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete business",
      });
    }
  }
);

// ============================================
// SERVICE ROUTES (within a business)
// ============================================

// Create a service for a business
router.post(
  "/:businessId/services",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { businessId } = req.params;
      const { name, description, duration, price } = req.body;

      // Verify business exists
      const business = await BusinessService.findById(businessId);
      if (!business) {
        res.status(404).json({
          success: false,
          message: "Business not found",
        });
        return;
      }

      if (!name) {
        res.status(400).json({
          success: false,
          message: "Service name is required",
        });
        return;
      }

      const service = await ServiceService.create({
        businessId,
        name,
        description: description || "",
        duration: duration || 60,
        price: price || 0,
        isActive: true,
      });

      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create service",
      });
    }
  }
);

// Update a service
router.put(
  "/services/:serviceId",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId } = req.params;
      const { name, description, duration, price, isActive } = req.body;

      const existing = await ServiceService.findById(serviceId);
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Service not found",
        });
        return;
      }

      const service = await ServiceService.update(serviceId, {
        name,
        description,
        duration,
        price,
        isActive,
      });

      res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update service",
      });
    }
  }
);

// Delete a service
router.delete(
  "/services/:serviceId",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId } = req.params;

      const existing = await ServiceService.findById(serviceId);
      if (!existing) {
        res.status(404).json({
          success: false,
          message: "Service not found",
        });
        return;
      }

      await ServiceService.delete(serviceId);

      res.json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete service",
      });
    }
  }
);

// Link a business to this website (admin only)
router.post(
  "/link",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { businessId } = req.body;

      if (!businessId) {
        res.status(400).json({
          success: false,
          message: "Business ID is required",
        });
        return;
      }

      // Verify business exists
      const business = await BusinessService.findById(businessId);
      if (!business) {
        res.status(404).json({
          success: false,
          message: "Business not found",
        });
        return;
      }

      // Save the linked business ID
      await SiteSettingsService.setLinkedBusinessId(businessId);

      res.json({
        success: true,
        message: "Business linked successfully",
        data: business,
      });
    } catch (error) {
      console.error("Error linking business:", error);
      res.status(500).json({
        success: false,
        message: "Failed to link business",
      });
    }
  }
);

// Unlink business from website (admin only)
router.delete(
  "/link",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      await SiteSettingsService.set("linkedBusinessId", null);

      res.json({
        success: true,
        message: "Business unlinked successfully",
      });
    } catch (error) {
      console.error("Error unlinking business:", error);
      res.status(500).json({
        success: false,
        message: "Failed to unlink business",
      });
    }
  }
);

// Get current site settings (admin only)
router.get(
  "/settings/current",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await SiteSettingsService.getAll();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error("Error getting site settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get site settings",
      });
    }
  }
);

export default router;
