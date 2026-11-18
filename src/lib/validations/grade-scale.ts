
import { z } from "zod";

const gradeBandSchema = z.object({
  letterGrade: z.enum(["A", "B", "C", "D", "E", "F"]),
  minScore: z.number().int().min(0).max(100),
  maxScore: z.number().int().min(0).max(100),
  gradePoint: z.number().min(0).max(5),
});

export const gradeScaleSchema = z.object({
  bands: z.array(gradeBandSchema).length(6),
}).superRefine(({ bands }, ctx) => {
  const expectedGrades = ["A", "B", "C", "D", "E", "F"];

  for (let i = 0; i < expectedGrades.length; i++) {
    if (bands[i]?.letterGrade !== expectedGrades[i]) {
      ctx.addIssue({
        code: "custom",
        message: "Grade bands must be submitted in A to F order.",
      });
      return;
    }
  }

  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];

    if (band.minScore > band.maxScore) {
      ctx.addIssue({
        code: "custom",
        message: `Minimum score cannot exceed maximum score for grade ${band.letterGrade}.`,
      });
    }

    if (i < bands.length - 1) {
      const nextBand = bands[i + 1];

      if (band.minScore !== nextBand.maxScore + 1) {
        ctx.addIssue({
          code: "custom",
          message: `The score ranges for grades ${band.letterGrade} and ${nextBand.letterGrade} must be consecutive, without gaps or overlaps.`,
        });
      }
    }
  }

  if (bands[0]?.maxScore !== 100) {
    ctx.addIssue({
      code: "custom",
      message: "Grade A must end at 100.",
    });
  }

  if (bands[5]?.minScore !== 0) {
    ctx.addIssue({
      code: "custom",
      message: "Grade F must start at 0.",
    });
  }
});

export type GradeScaleInput = z.infer<typeof gradeScaleSchema>;
