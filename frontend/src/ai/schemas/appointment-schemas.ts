/**
 * @fileOverview Zod schemas and TypeScript types for appointment scheduling.
 *
 * - ScheduleAppointmentInputSchema - The Zod schema for appointment scheduling input.
 * - ScheduleAppointmentInput - The TypeScript type inferred from the input schema.
 * - ScheduleAppointmentOutputSchema - The Zod schema for appointment scheduling output.
 * - ScheduleAppointmentOutput - The TypeScript type inferred from the output schema.
 */
import {z} from 'zod';

export const ScheduleAppointmentInputSchema = z.object({
  fullName: z.string().min(2).describe('The full name of the person scheduling the appointment.'),
  email: z.string().email().describe('The email address of the person.'),
  phone: z.string().optional().describe('The phone number of the person.'),
  service: z.string().describe('The service the person is interested in.'),
  preferredDate: z.string().describe('The preferred date for the appointment.'),
  preferredTime: z.string().describe('The preferred time for the appointment.'),
  notes: z.string().optional().describe('Any additional notes from the person.'),
});
export type ScheduleAppointmentInput = z.infer<typeof ScheduleAppointmentInputSchema>;

export const ScheduleAppointmentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ScheduleAppointmentOutput = z.infer<typeof ScheduleAppointmentOutputSchema>;
