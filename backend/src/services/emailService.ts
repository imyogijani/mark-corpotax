import nodemailer from "nodemailer";
import { getFirestore } from "../config/firebase";
import crypto from "crypto";

// Collection for storing password reset tokens
const PASSWORD_RESET_COLLECTION = "passwordResetTokens";

// Email transporter configuration
let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter
 */
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Email configuration
 */
const EMAIL_CONFIG = {
  from:
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "noreply@markcorpotax.com",
  fromName: process.env.SMTP_FROM_NAME || "MARK Corpotax",
};

/**
 * Interface for password reset token
 */
interface IPasswordResetToken {
  id?: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

/**
 * Email Service - handles all email operations with Firebase storage
 */
export const EmailService = {
  /**
   * Send a generic email
   */
  async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<boolean> {
    try {
      const mailTransporter = getTransporter();

      await mailTransporter.sendMail({
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.from}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`✅ Email sent to ${options.to}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return false;
    }
  },

  /**
   * Generate password reset token and store in Firebase
   */
  async generatePasswordResetToken(email: string): Promise<string | null> {
    try {
      const db = getFirestore();

      // Generate secure random token
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Token expires in 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Delete any existing tokens for this email
      const existingTokens = await db
        .collection(PASSWORD_RESET_COLLECTION)
        .where("email", "==", email.toLowerCase())
        .get();

      const batch = db.batch();
      existingTokens.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Store new token in Firebase
      await db.collection(PASSWORD_RESET_COLLECTION).add({
        email: email.toLowerCase(),
        token: hashedToken,
        expiresAt,
        used: false,
        createdAt: new Date(),
      });

      return token; // Return unhashed token for the email
    } catch (error) {
      console.error("❌ Failed to generate reset token:", error);
      return null;
    }
  },

  /**
   * Verify password reset token from Firebase
   */
  async verifyPasswordResetToken(
    token: string
  ): Promise<{ valid: boolean; email?: string }> {
    try {
      const db = getFirestore();
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const snapshot = await db
        .collection(PASSWORD_RESET_COLLECTION)
        .where("token", "==", hashedToken)
        .where("used", "==", false)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return { valid: false };
      }

      const tokenDoc = snapshot.docs[0];
      const tokenData = tokenDoc.data() as IPasswordResetToken;

      // Check if token is expired
      const expiresAt =
        tokenData.expiresAt instanceof Date
          ? tokenData.expiresAt
          : (tokenData.expiresAt as any).toDate();

      if (expiresAt < new Date()) {
        // Token expired - mark as used
        await tokenDoc.ref.update({ used: true });
        return { valid: false };
      }

      return { valid: true, email: tokenData.email };
    } catch (error) {
      console.error("❌ Failed to verify reset token:", error);
      return { valid: false };
    }
  },

  /**
   * Mark token as used after password reset
   */
  async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      const db = getFirestore();
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const snapshot = await db
        .collection(PASSWORD_RESET_COLLECTION)
        .where("token", "==", hashedToken)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({ used: true });
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to mark token as used:", error);
      return false;
    }
  },

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetUrl: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MARK Corpotax</h1>
          <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Financial Partner</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Password Reset Request</h2>
          
          <p>Hello,</p>
          
          <p>We received a request to reset the password for your account associated with this email address.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #d4af37 0%, #c4a030 100%); 
                      color: #1e3a5f; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;
                      display: inline-block;
                      font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #2d5a87; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <div style="background: #fff8e1; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} MARK Corpotax. All rights reserved.<br>
            <a href="https://markcorpotax.com" style="color: #2d5a87;">markcorpotax.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request - MARK Corpotax
      
      Hello,
      
      We received a request to reset the password for your account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      © ${new Date().getFullYear()} MARK Corpotax
    `;

    return this.sendEmail({
      to: email,
      subject: "Reset Your Password - MARK Corpotax",
      html,
      text,
    });
  },

  /**
   * Send contact form reply email
   */
  async sendContactReply(options: {
    to: string;
    customerName: string;
    originalSubject: string;
    originalMessage: string;
    replyMessage: string;
  }): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reply from MARK Corpotax</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MARK Corpotax</h1>
          <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Financial Partner</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Hello ${
            options.customerName
          },</h2>
          
          <p>Thank you for contacting us. Here is our response to your inquiry:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-line;">${
              options.replyMessage
            }</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px;"><strong>Your Original Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;"><strong>Subject:</strong> ${
              options.originalSubject
            }</p>
            <p style="margin: 0; color: #666; font-size: 13px; white-space: pre-line;">${
              options.originalMessage
            }</p>
          </div>
          
          <p style="margin-top: 30px;">
            If you have any further questions, please don't hesitate to reach out.
          </p>
          
          <p style="margin-bottom: 0;">
            Best regards,<br>
            <strong>The MARK Corpotax Team</strong>
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} MARK Corpotax. All rights reserved.<br>
            <a href="https://markcorpotax.com" style="color: #2d5a87;">markcorpotax.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hello ${options.customerName},
      
      Thank you for contacting us. Here is our response to your inquiry:
      
      ${options.replyMessage}
      
      ---
      Your Original Message:
      Subject: ${options.originalSubject}
      ${options.originalMessage}
      ---
      
      If you have any further questions, please don't hesitate to reach out.
      
      Best regards,
      The MARK Corpotax Team
      
      © ${new Date().getFullYear()} MARK Corpotax
    `;

    return this.sendEmail({
      to: options.to,
      subject: `Re: ${options.originalSubject} - MARK Corpotax`,
      html,
      text,
    });
  },

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(options: {
    to: string;
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    businessName?: string;
  }): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MARK Corpotax</h1>
          <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 14px;">Appointment Confirmed ✓</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Hello ${
            options.customerName
          },</h2>
          
          <p>Your appointment has been confirmed! Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #666;">Service:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  ${options.serviceName}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #666;">Date:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  ${options.date}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #666;">Time:</strong>
                </td>
                <td style="padding: 10px 0; text-align: right;">
                  ${options.time}
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #2e7d32; font-size: 14px;">
              ✓ We look forward to seeing you!
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} MARK Corpotax. All rights reserved.<br>
            <a href="https://markcorpotax.com" style="color: #2d5a87;">markcorpotax.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: options.to,
      subject: `Appointment Confirmed - ${options.serviceName} on ${options.date}`,
      html,
    });
  },

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(options: {
    to: string;
    name: string;
  }): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MARK Corpotax</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to MARK Corpotax</h1>
          <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Financial Partner</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Hello ${options.name}!</h2>
          
          <p>Welcome to MARK Corpotax! We're excited to have you on board.</p>
          
          <p>As your trusted financial partner, we're here to help you with:</p>
          
          <ul style="color: #666;">
            <li>Tax Planning & Preparation</li>
            <li>Corporate Tax Services</li>
            <li>Financial Consulting</li>
            <li>Business Advisory</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://markcorpotax.com/dashboard" 
               style="background: linear-gradient(135deg, #d4af37 0%, #c4a030 100%); 
                      color: #1e3a5f; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;
                      display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          
          <p>If you have any questions, feel free to contact us anytime.</p>
          
          <p style="margin-bottom: 0;">
            Best regards,<br>
            <strong>The MARK Corpotax Team</strong>
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} MARK Corpotax. All rights reserved.<br>
            <a href="https://markcorpotax.com" style="color: #2d5a87;">markcorpotax.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: options.to,
      subject: "Welcome to MARK Corpotax!",
      html,
    });
  },

  /**
   * Cleanup expired tokens (run periodically)
   */
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const db = getFirestore();
      const now = new Date();
      const snapshot = await db
        .collection(PASSWORD_RESET_COLLECTION)
        .where("expiresAt", "<", now)
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      console.log(`✅ Cleaned up ${snapshot.size} expired tokens`);
      return snapshot.size;
    } catch (error) {
      console.error("❌ Failed to cleanup expired tokens:", error);
      return 0;
    }
  },
};

export default EmailService;
