/**
 * @fileOverview Zod schemas and TypeScript types for contact form submissions.
 */
import {z} from 'zod';

export const ContactFormInputSchema = z.object({
  name: z.string().min(2).describe("The user's name."),
  email: z.string().email().describe("The user's email."),
  subject: z.string().min(5).describe('The subject of the message.'),
  message: z.string().min(10).max(500).describe('The message content.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

export const ContactFormOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;
