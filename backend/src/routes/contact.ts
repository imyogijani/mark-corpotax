import express from "express";
import { Request, Response } from "express";
import {
  ContactService,
  UserService,
  NotificationService,
} from "../services/firebaseService";
import { EmailService } from "../services/emailService";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Create new contact using Firebase
    const contact = await ContactService.create({
      name,
      email,
      subject,
      message,
      phone: phone || undefined,
    });

    // Create notification for the user if they have an account
    const user = await UserService.findByEmail(email);
    if (user) {
      await NotificationService.create({
        userId: user.id!,
        type: "success",
        title: "Query Submitted",
        message: `Your inquiry "${subject}" has been submitted successfully. We'll get back to you soon.`,
        category: "contact",
        actionUrl: "/dashboard",
        actionLabel: "View Dashboard",
        metadata: {
          contactId: contact.id,
          subject,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error submitting contact form",
    });
  }
});

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { status, limit = 50 } = req.query;

      let contacts = await ContactService.findAll();

      // Filter by status if provided
      if (status) {
        contacts = contacts.filter((c) => c.status === status);
      }

      // Sort by createdAt descending and limit
      contacts = contacts
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        )
        .slice(0, parseInt(limit as string));

      res.status(200).json({
        success: true,
        message: "Contact submissions retrieved successfully",
        data: contacts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error retrieving contact submissions",
      });
    }
  }
);

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contact = await ContactService.update(id, { status });

      if (!contact) {
        res.status(404).json({
          success: false,
          message: "Contact not found",
        });
        return;
      }

      // Notify user if they have an account
      const user = await UserService.findByEmail(contact.email);
      if (user && status !== "new") {
        let notificationMessage = "";
        let notificationType: "info" | "success" | "warning" | "error" = "info";

        switch (status) {
          case "read":
            notificationMessage = `Your inquiry "${contact.subject}" has been reviewed by our team`;
            notificationType = "info";
            break;
          case "replied":
            notificationMessage = `We've responded to your inquiry "${contact.subject}". Please check your email.`;
            notificationType = "success";
            break;
          default:
            notificationMessage = `Your inquiry status has been updated to ${status}`;
        }

        await NotificationService.create({
          userId: user.id!,
          type: notificationType,
          title: "Query Status Update",
          message: notificationMessage,
          category: "contact",
          actionUrl: "/dashboard",
          actionLabel: "View Dashboard",
          metadata: {
            contactId: contact.id,
            status,
            subject: contact.subject,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Contact status updated successfully",
        data: contact,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error updating contact",
      });
    }
  }
);

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const contact = await ContactService.findById(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: "Contact not found",
        });
        return;
      }

      await ContactService.delete(id);

      res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error deleting contact",
      });
    }
  }
);

// @desc    Get user's own contact submissions
// @route   GET /api/contact/my
// @access  Private/User
router.get("/my", protect, async (req: any, res: Response) => {
  try {
    const userEmail = req.user.email;

    let contacts = await ContactService.findAll();

    // Filter by user email, sort and limit
    contacts = contacts
      .filter((c) => c.email === userEmail)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 10);

    res.status(200).json({
      success: true,
      message: "User contact submissions retrieved successfully",
      data: contacts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving contact submissions",
    });
  }
});

// @desc    Reply to contact submission via email
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
router.post(
  "/:id/reply",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { replyMessage } = req.body;

      if (!replyMessage || replyMessage.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Reply message is required",
        });
        return;
      }

      // Get the contact
      const contact = await ContactService.findById(id);
      if (!contact) {
        res.status(404).json({
          success: false,
          message: "Contact not found",
        });
        return;
      }

      // Send reply email
      const emailSent = await EmailService.sendContactReply({
        to: contact.email,
        customerName: contact.name,
        originalSubject: contact.subject,
        originalMessage: contact.message,
        replyMessage: replyMessage.trim(),
      });

      if (!emailSent) {
        res.status(500).json({
          success: false,
          message: "Failed to send reply email. Please try again.",
        });
        return;
      }

      // Update contact status to replied
      await ContactService.update(id, { status: "replied" });

      // Notify user if they have an account
      const user = await UserService.findByEmail(contact.email);
      if (user) {
        await NotificationService.create({
          userId: user.id!,
          type: "success",
          title: "Reply Received",
          message: `We've responded to your inquiry "${contact.subject}". Please check your email.`,
          category: "contact",
          actionUrl: "/dashboard",
          actionLabel: "View Dashboard",
          metadata: {
            contactId: contact.id,
            subject: contact.subject,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Reply sent successfully",
        data: { emailSent: true },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error sending reply",
      });
    }
  }
);

export default router;
