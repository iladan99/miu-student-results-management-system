
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import {
  caScoreSchema,
  examScoreSchema,
} from "@/lib/validations/result";
import {
  saveLecturerCAScore,
  saveLecturerExamScore,
  submitLecturerCourseResults,
} from "@/services/result";

export type CAActionState = {
  success: boolean;
  message: string;
};

export type ExamActionState = {
  success: boolean;
  message: string;
};

export type SubmitResultsActionState = {
  success: boolean;
  message: string;
};

export async function saveCAScoreAction(
  _previousState: CAActionState,
  formData: FormData
): Promise<CAActionState> {
  const user = await requireRole(["LECTURER"]);

  try {
    const validation = caScoreSchema.safeParse({
      assignmentId: formData.get("assignmentId"),
      registrationId: formData.get("registrationId"),
      caScore: formData.get("caScore"),
    });

    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ??
          "Invalid CA score.",
      };
    }

    const { assignmentId, registrationId, caScore } =
      validation.data;

    await saveLecturerCAScore(
      user.id,
      assignmentId,
      registrationId,
      caScore
    );

    revalidatePath(
      `/lecturer/courses/${assignmentId}/students`
    );

    return {
      success: true,
      message: "CA score and grade saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to save CA score.",
    };
  }
}

export async function saveExamScoreAction(
  _previousState: ExamActionState,
  formData: FormData
): Promise<ExamActionState> {
  const user = await requireRole(["LECTURER"]);

  try {
    const validation = examScoreSchema.safeParse({
      assignmentId: formData.get("assignmentId"),
      registrationId: formData.get("registrationId"),
      examScore: formData.get("examScore"),
    });

    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ??
          "Invalid examination score.",
      };
    }

    const { assignmentId, registrationId, examScore } =
      validation.data;

    await saveLecturerExamScore(
      user.id,
      assignmentId,
      registrationId,
      examScore
    );

    revalidatePath(
      `/lecturer/courses/${assignmentId}/students`
    );

    return {
      success: true,
      message: "Examination score and grade saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to save examination score.",
    };
  }
}

export async function submitCourseResultsAction(
  _previousState: SubmitResultsActionState,
  formData: FormData
): Promise<SubmitResultsActionState> {
  const user = await requireRole(["LECTURER"]);

  try {
    const assignmentId = formData.get("assignmentId");

    if (
      typeof assignmentId !== "string" ||
      assignmentId.trim() === ""
    ) {
      return {
        success: false,
        message: "Invalid course assignment.",
      };
    }

    const result = await submitLecturerCourseResults(
      user.id,
      assignmentId
    );

    revalidatePath(
      `/lecturer/courses/${assignmentId}/students`
    );

    return {
      success: true,
      message: `${result.submittedCount} student result(s) submitted successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to submit course results.",
    };
  }
}
