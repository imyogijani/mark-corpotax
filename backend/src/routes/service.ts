import express from "express";
import { Request, Response } from "express";
import { SiteSettingsService } from "../services/firebaseService";
import { ServiceDatabaseService } from "../services/appointmentDatabase";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// Use the unified service database service
// (automatically uses external DB when configured, default DB otherwise)
const ServiceService = ServiceDatabaseService;

// @desc    Get all services (for appointment booking)
// @route   GET /api/services
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    // Get linked business ID
    const businessId = await SiteSettingsService.getLinkedBusinessId();

    if (!businessId) {
      // Return empty if no business is linked
      return res.status(200).json({
        success: true,
        message: "No business linked",
        data: [],
      });
    }

    // Get services from the appropriate database
    const services = await ServiceService.findByBusinessId(businessId);

    return res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving services",
    });
  }
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await ServiceService.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving service",
    });
  }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const businessId = await SiteSettingsService.getLinkedBusinessId();
      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "No business linked to the website",
        });
      }

      const service = await ServiceService.create({
        ...req.body,
        businessId,
      });

      return res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Error creating service",
      });
    }
  }
);

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const service = await ServiceService.update(id, req.body);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Error updating service",
      });
    }
  }
);

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const service = await ServiceService.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      await ServiceService.delete(id);

      return res.status(200).json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Error deleting service",
      });
    }
  }
);

export default router;
