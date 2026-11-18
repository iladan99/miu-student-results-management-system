
import { z } from "zod";

export const lecturerSchema = z.object({
  fullName: z.string().trim()
    .min(3, "Full name must contain at least 3 characters.")
    .max(150),

  email: z.string().trim()
    .email("Enter a valid email address.")
    .transform((value) => value.toLowerCase()),

  staffNumber: z.string().trim()
    .min(3, "Staff number is required.")
    .max(40)
    .transform((value) => value.toUpperCase()),

  departmentId: z.string().min(1, "Select a department."),
});

export type LecturerInput = z.infer<typeof lecturerSchema>;

export const lecturerUpdateSchema = z.object({
  id: z.string().min(1, "Lecturer record is required."),

  fullName: z.string().trim()
    .min(3, "Full name must contain at least 3 characters.")
    .max(150),

  email: z.string().trim()
    .email("Enter a valid email address.")
    .transform((value) => value.toLowerCase()),

  staffNumber: z.string().trim()
    .min(3, "Staff number is required.")
    .max(40)
    .transform((value) => value.toUpperCase()),

  departmentId: z.string().min(1, "Select a department."),
});

export type LecturerUpdateInput = z.infer<
  typeof lecturerUpdateSchema
>;
