import express from "express";
import { Request, Response } from "express";
import { SiteSettingsService } from "../services/firebaseService";
import { ServiceDatabaseService } from "../services/appointmentDatabase";

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

export default router;
