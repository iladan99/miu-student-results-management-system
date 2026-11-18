
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { gradeScaleSchema } from "@/lib/validations/grade-scale";
import { saveGradeScaleConfiguration } from "@/services/grade-scale";

export type GradeScaleActionState = {
  success: boolean;
  message: string;
};

export async function saveGradeScaleAction(
  _previousState: GradeScaleActionState,
  formData: FormData
): Promise<GradeScaleActionState> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  try {
    const grades = ["A", "B", "C", "D", "E", "F"] as const;

    const bands = grades.map((letterGrade) => ({
      letterGrade,
      minScore: Number(formData.get(`${letterGrade}_minScore`)),
      maxScore: Number(formData.get(`${letterGrade}_maxScore`)),
      gradePoint: Number(formData.get(`${letterGrade}_gradePoint`)),
    }));

    const validation = gradeScaleSchema.safeParse({ bands });

    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ??
          "Please check the grading boundaries.",
      };
    }

    await saveGradeScaleConfiguration(validation.data);

    revalidatePath("/admin/academic/grade-scales");

    return {
      success: true,
      message: "Grading scale saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to save the grading scale.",
    };
  }
}
