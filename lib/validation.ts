import { z } from "zod";

export const email = z.string().trim().toLowerCase().email().max(254);
export const strongPassword = z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/);
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
export const setupSchema = z.object({
  clinicName: z.string().trim().min(2).max(120), firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80), email, password: strongPassword
});
export const patientSchema = z.object({
  patientId: z.string().trim().min(2).max(40), firstName: z.string().trim().min(1).max(80), middleName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().min(1).max(80), dateOfBirth: z.coerce.date().max(new Date()), sex: z.enum(["MALE","FEMALE","INTERSEX","PREFER_NOT_TO_SAY"]),
  contactNumber: z.string().trim().min(5).max(30), email: z.union([email, z.literal("")]).optional(), address: z.string().trim().max(300).optional(),
  emergencyContact: z.string().trim().max(160).optional(), emergencyContactNumber: z.string().trim().max(30).optional(), bloodType: z.string().trim().max(8).optional(),
  allergies: z.string().trim().max(2000).optional(), existingConditions: z.string().trim().max(2000).optional()
});
export const appointmentSchema = z.object({
  patientId: z.string().cuid(), doctorId: z.string().cuid(), startsAt: z.coerce.date(), endsAt: z.coerce.date(), reason: z.string().trim().min(2).max(500), notes: z.string().trim().max(2000).optional()
}).refine(v => v.endsAt > v.startsAt, { message: "End time must be after start time", path: ["endsAt"] });

