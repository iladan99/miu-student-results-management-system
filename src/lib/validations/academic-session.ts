
import { z } from "zod";

export const academicSessionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(4, "Enter a valid academic session name.")
      .max(20, "Academic session name is too long."),

    startDate: z.string().min(1, "Select a start date."),

    endDate: z.string().min(1, "Select an end date."),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      return (
        !Number.isNaN(start.getTime()) &&
        !Number.isNaN(end.getTime()) &&
        end >= start
      );
    },
    {
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    }
  );

export type AcademicSessionInput = z.infer<
  typeof academicSessionSchema
>;
