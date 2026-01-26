import express from "express";
import { Request, Response } from "express";
import {
  AppointmentService,
  NotificationService,
  UserService,
} from "../services/firebaseService";
import { protect, authorize } from "../middleware/auth";
import nodemailer from "nodemailer";

const router = express.Router();

// Email transporter setup
const getEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send appointment confirmation email
const sendAppointmentEmail = async (
  appointment: any,
  type: "confirmation" | "update" | "reminder",
) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("Email not configured - skipping email send");
      return false;
    }

    const transporter = getEmailTransporter();
    const companyName = "Mark Corpotax";

    const appointmentDate = new Date(appointment.date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "confirmation":
        subject = `Appointment Request Received - ${companyName}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #004D6E 0%, #00ACCC 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Appointment Request Received!</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Dear <strong>${appointment.name}</strong>,</p>
              <p>Thank you for your appointment request. We have received your details and our team will contact you shortly to confirm.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                      appointment.serviceName || "General Consultation"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Preferred Date:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointmentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong>Preferred Time:</strong></td>
                    <td style="padding: 10px 0;">${appointment.time}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #666;">Our team will review your request and contact you within 24 hours to confirm your appointment.</p>
              <p style="color: #666;">Thank you for choosing ${companyName}!</p>
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        `;
        break;

      case "update":
        subject = `Appointment Status Update - ${companyName}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #004D6E 0%, #00ACCC 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Appointment Update</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Dear <strong>${appointment.name}</strong>,</p>
              <p>Your appointment status has been updated to: <strong style="color: ${
                appointment.status === "confirmed"
                  ? "#10b981"
                  : appointment.status === "cancelled"
                    ? "#ef4444"
                    : appointment.status === "completed"
                      ? "#3b82f6"
                      : "#f59e0b"
              };">${appointment.status.toUpperCase()}</strong></p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                      appointment.serviceName || "General Consultation"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointmentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong>Time:</strong></td>
                    <td style="padding: 10px 0;">${appointment.time}</td>
                  </tr>
                </table>
              </div>
              
              ${
                appointment.adminNotes
                  ? `<p><strong>Note from our team:</strong> ${appointment.adminNotes}</p>`
                  : ""
              }
              <p style="color: #666;">Thank you for choosing ${companyName}!</p>
            </div>
          </div>
        `;
        break;

      case "reminder":
        subject = `Appointment Reminder - ${companyName}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Appointment Reminder</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Dear <strong>${appointment.name}</strong>,</p>
              <p>This is a friendly reminder about your upcoming appointment:</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 24px; text-align: center; color: #004D6E;">
                  <strong>${appointmentDate}</strong><br>
                  at <strong>${appointment.time}</strong>
                </p>
              </div>
              
              <p style="color: #666;">We look forward to seeing you!</p>
            </div>
          </div>
        `;
        break;
    }

    await transporter.sendMail({
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: appointment.email,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${appointment.email} - ${type}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Public
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, serviceId, serviceName, date, time, message } =
      req.body;

    // Create new appointment
    const appointment = await AppointmentService.create({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      serviceId: serviceId || "",
      serviceName: serviceName || "General Consultation",
      date: date,
      time,
      message: message || "",
      source: "website",
      status: "pending",
      businessId: "website", // Simple identifier for website appointments
    });

    // Send success response immediately to make UI snappy
    res.status(201).json({
      success: true,
      message:
        "Appointment request submitted successfully! We will contact you shortly to confirm.",
      data: appointment,
    });

    // Handle background tasks (Notifications only - Email disabled)
    // We execute this without awaiting to prevent blocking the response
    (async () => {
      try {
        // Email sending disabled as per request
        // const emailSent = await sendAppointmentEmail(appointment, "confirmation");
        // if (emailSent) {
        //   await AppointmentService.update(appointment.id!, { emailSent: true });
        // }

        // Create notification for admin users
        const admins = await UserService.findAll();
        const adminUsers = admins.filter((u) => u.role === "admin");

        // Use Promise.all for parallel notification creation
        await Promise.all(
          adminUsers.map((admin) =>
            NotificationService.create({
              userId: admin.id!,
              type: "info",
              title: "New Appointment Request",
              message: `New appointment request from ${name} for ${
                serviceName || "consultation"
              } on ${date} at ${time}`,
              category: "appointment",
              actionUrl: "/admin/appointments",
              actionLabel: "View Appointments",
              metadata: {
                appointmentId: appointment.id,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
              },
            }),
          ),
        );
      } catch (bgError) {
        console.error("Background task error (Email/Notification):", bgError);
      }
    })();
  } catch (error: any) {
    console.error("Error booking appointment:", error);
    // Only send error response if we haven't sent success yet
    if (!res.headersSent) {
      res.status(400).json({
        success: false,
        message: error.message || "Error submitting appointment request",
      });
    }
  }
});

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments
// @access  Private/Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, date, limit = 50 } = req.query;

      let appointments = await AppointmentService.findAll();

      // Filter by status if provided
      if (status) {
        appointments = appointments.filter((a) => a.status === status);
      }

      // Filter by date if provided
      if (date) {
        appointments = appointments.filter((a) => a.date === date);
      }

      // Limit results
      appointments = appointments.slice(0, parseInt(limit as string));

      res.status(200).json({
        success: true,
        message: "Appointments retrieved successfully",
        data: appointments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error retrieving appointments",
      });
    }
  },
);

// @desc    Get appointment stats
// @route   GET /api/appointments/stats
// @access  Private/Admin
router.get(
  "/stats",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const appointments = await AppointmentService.findAll();

      const stats = {
        total: appointments.length,
        pending: appointments.filter((a) => a.status === "pending").length,
        confirmed: appointments.filter((a) => a.status === "confirmed").length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error getting stats",
      });
    }
  },
);

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private/Admin
router.get(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const appointment = await AppointmentService.findById(id);

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error retrieving appointment",
      });
    }
  },
);

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, adminNotes, date, time } = req.body;

      const existingAppointment = await AppointmentService.findById(id);

      if (!existingAppointment) {
        res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
        return;
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      if (date) updateData.date = date;
      if (time) updateData.time = time;

      const appointment = await AppointmentService.update(id, updateData);

      // Send update email if status changed
      if (status && status !== existingAppointment.status) {
        const emailSent = await sendAppointmentEmail(appointment, "update");
        if (emailSent) {
          await AppointmentService.update(id, { emailSent: true });
        }
      }

      res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        data: appointment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error updating appointment",
      });
    }
  },
);

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const appointment = await AppointmentService.findById(id);

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
        return;
      }

      await AppointmentService.delete(id);

      res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error deleting appointment",
      });
    }
  },
);

// @desc    Get user's own appointments
// @route   GET /api/appointments/my
// @access  Private/User
router.get("/my", protect, async (req: any, res: Response): Promise<void> => {
  try {
    const userEmail = req.user.email;
    const appointments = await AppointmentService.findByEmail(userEmail);

    res.status(200).json({
      success: true,
      message: "User appointments retrieved successfully",
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving appointments",
    });
  }
});

export default router;
