
import { z } from "zod";

export const courseAssignmentSchema = z.object({
  lecturerId: z.string().min(1, "Select a lecturer."),
  courseId: z.string().min(1, "Select a course."),
  academicSessionId: z.string().min(1, "Select an academic session."),
  semesterId: z.string().min(1, "Select a semester."),
});

export type CourseAssignmentInput = z.infer<
  typeof courseAssignmentSchema
>;
