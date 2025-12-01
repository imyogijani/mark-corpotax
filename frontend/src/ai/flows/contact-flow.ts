'use server';
/**
 * @fileOverview A flow for handling contact form submissions.
 *
 * - sendContactMessage - A function that handles the contact form submission.
 * - ContactFormInput - The input type for the sendContactMessage function.
 * - ContactFormOutput - The return type for the sendContactMessage function.
 */

import {
  type ContactFormInput,
  type ContactFormOutput,
} from '@/ai/schemas/contact-schemas';

export async function sendContactMessage(input: ContactFormInput): Promise<ContactFormOutput> {
  // Simplified contact form handling without AI dependencies
  // In production, this would send email and save to database
  
  console.log('New contact message received:', input);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create professional response message
  const responseMessage = `Dear ${input.name},

Thank you for contacting MARK GROUP. We have received your message and appreciate your interest in our financial services.

Your Message Details:
- Name: ${input.name}
- Email: ${input.email}
- Subject: ${input.subject || 'General Inquiry'}
- Message: ${input.message}

Our team will review your inquiry and respond within 24 hours. For urgent matters, please contact us directly:

- Finance Division: +91 97120 67891
- Taxation Division: +91 97738 22604
- Email: markcorpotax@gmail.com

Best regards,
MARK GROUP Customer Service Team`;

  return {
    success: true,
    message: responseMessage,
  };
}
