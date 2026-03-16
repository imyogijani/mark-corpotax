import express from "express";
import { Request, Response } from "express";
import { TeamService } from "../services/firebaseService";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const members = await TeamService.findAll();
    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const member = await TeamService.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});

// @desc    Create team member
// @route   POST /api/team
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req: Request, res: Response) => {
  try {
    const member = await TeamService.create(req.body);
    return res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Bad Request",
    });
  }
});

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req: Request, res: Response) => {
  try {
    const member = await TeamService.update(req.params.id, req.body);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Bad Request",
    });
  }
});

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response) => {
  try {
    const success = await TeamService.delete(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});

export default router;
