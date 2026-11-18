import { z } from "zod";

export const semesterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Enter a valid semester name.")
    .max(30, "Semester name is too long."),
  academicSessionId: z
    .string()
    .min(1, "Select an academic session."),
});

export type SemesterInput = z.infer<typeof semesterSchema>;