
import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Department name must contain at least 3 characters.")
    .max(100, "Department name is too long."),

  code: z
    .string()
    .trim()
    .min(2, "Department code must contain at least 2 characters.")
    .max(20, "Department code is too long.")
    .transform((value) => value.toUpperCase()),

  facultyId: z
    .string()
    .min(1, "Select a faculty."),

});

export type DepartmentInput = z.infer<typeof departmentSchema>;
