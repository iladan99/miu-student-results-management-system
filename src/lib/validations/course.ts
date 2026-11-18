
import { z } from "zod";

export const courseSchema = z.object({
  code: z.string().trim().min(2, "Course code is required.").max(20)
    .transform((value) => value.toUpperCase()),
  title: z.string().trim().min(3, "Course title must contain at least 3 characters.").max(150),
  description: z.string().trim().max(1000).optional(),
  creditUnits: z.coerce.number().int().min(1).max(10),
  departmentId: z.string().min(1, "Select a department."),
  academicLevelId: z.string().min(1, "Select an academic level."),
  courseType: z.enum(["COMPULSORY", "ELECTIVE"]),
});

export type CourseInput = z.infer<typeof courseSchema>;
