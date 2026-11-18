
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { reviewCourseResults } from "@/services/result";

export type ReviewActionState = {
  success: boolean;
  message: string;
};

export async function reviewCourseResultsAction(
  _previousState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const user = await requireRole(["ADMIN", "ADMINISTRATOR"]);

  try {
    const assignmentId = formData.get("assignmentId");
    const decision = formData.get("decision");
    const comments = formData.get("comments");

    if (
      typeof assignmentId !== "string" ||
      assignmentId.trim() === ""
    ) {
      return {
        success: false,
        message: "Invalid course assignment.",
      };
    }

    if (decision !== "APPROVED" && decision !== "REJECTED") {
      return {
        success: false,
        message: "Invalid review decision.",
      };
    }

    if (typeof comments !== "string") {
      return {
        success: false,
        message: "Invalid review comments.",
      };
    }

    if (comments.length > 500) {
      return {
        success: false,
        message: "Comments cannot exceed 500 characters.",
      };
    }

    await reviewCourseResults(
      user.id,
      assignmentId,
      decision,
      comments
    );

    revalidatePath("/admin/results");
    revalidatePath(`/admin/results/${assignmentId}`);

    return {
      success: true,
      message:
        decision === "APPROVED"
          ? "Course results approved successfully."
          : "Course results rejected. The lecturer can now make corrections.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to process the review.",
    };
  }
}
