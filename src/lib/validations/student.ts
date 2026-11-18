
import { z } from "zod";

export const studentSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must contain at least 3 characters.").max(150),
  email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  registrationNo: z.string().trim().min(4, "Registration number is required.").max(40).transform((value) => value.toUpperCase()),
  departmentId: z.string().min(1, "Select a department."),
  admissionYear: z.coerce.number().int().min(2000).max(2100),
  academicSessionId: z.string().min(1, "Select an academic session."),
  academicLevelId: z.string().min(1, "Select an academic level."),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const studentUpdateSchema = z.object({
    id: z.string().min(1, "Student record is required."),
    fullName: z.string().trim().min(3, "Full name must contain at least 3 characters.").max(150),
    email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
    registrationNo: z.string().trim().min(4, "Registration number is required.").max(40).transform((value) => value.toUpperCase()),
    departmentId: z.string().min(1, "Select a department."),
    admissionYear: z.coerce.number().int().min(2000).max(2100),
  });
  
  export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;

export const bulkStudentRowSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must contain at least 3 characters.").max(150),
  email: z.string().trim().email("Invalid email address.").transform((value) => value.toLowerCase()),
  registrationNo: z.string().trim().min(4, "Registration number is required.").max(40).transform((value) => value.toUpperCase()),
  departmentCode: z.string().trim().min(2, "Department code is required.").transform((value) => value.toUpperCase()),
  admissionYear: z.coerce.number().int().min(2000).max(2100),
  academicSession: z.string().trim().min(1, "Academic session is required."),
  academicLevel: z.string().trim().min(1, "Academic level is required."),
});

export type BulkStudentRow = z.infer<typeof bulkStudentRowSchema>;

  
