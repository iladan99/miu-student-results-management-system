
import { z } from "zod";

const scoreFields = {
  assignmentId: z.string().min(1, "Course assignment is required."),
  registrationId: z.string().min(1, "Student registration is required."),
};

export const caScoreSchema = z.object({
  ...scoreFields,
  caScore: z
    .string()
    .trim()
    .min(1, "Enter a CA score.")
    .transform(Number)
    .pipe(
      z.number()
        .finite("Enter a valid score.")
        .min(0, "CA score cannot be below 0.")
        .max(40, "CA score cannot exceed 40.")
    ),
});

export const examScoreSchema = z.object({
  ...scoreFields,
  examScore: z
    .string()
    .trim()
    .min(1, "Enter an examination score.")
    .transform(Number)
    .pipe(
      z.number()
        .finite("Enter a valid score.")
        .min(0, "Examination score cannot be below 0.")
        .max(60, "Examination score cannot exceed 60.")
    ),
});

export type CAScoreInput = z.infer<typeof caScoreSchema>;
export type ExamScoreInput = z.infer<typeof examScoreSchema>;
