import { z } from "zod";

export const academicLevelSchema = z.object({
  name: z.string().trim().min(2, "Level name is required.").max(50),
  levelNumber: z.coerce
    .number()
    .int("Level number must be a whole number.")
    .min(1, "Level number must be greater than zero.")
    .max(1000, "Level number is too large."),
});

export type AcademicLevelInput = z.infer<typeof academicLevelSchema>;