
import { z } from "zod";

export const facultySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Faculty name must contain at least 3 characters.")
    .max(100, "Faculty name is too long."),

  code: z
    .string()
    .trim()
    .min(2, "Faculty code is required.")
    .max(20, "Faculty code is too long.")
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long.")
    .optional(),
});

export type FacultyInput = z.infer<typeof facultySchema>;
