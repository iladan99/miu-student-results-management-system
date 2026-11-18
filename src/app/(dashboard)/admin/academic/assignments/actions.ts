
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { courseAssignmentSchema } from "@/lib/validations/course-assignment";
import {
  createCourseAssignment,
  deleteCourseAssignment,
} from "@/services/course-assignment";

export type CourseAssignmentActionState = {
  success: boolean;
  message: string;
};

export async function createCourseAssignmentAction(
  _previousState: CourseAssignmentActionState,
  formData: FormData
): Promise<CourseAssignmentActionState> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const parsed = courseAssignmentSchema.safeParse({
    lecturerId: formData.get("lecturerId"),
    courseId: formData.get("courseId"),
    academicSessionId: formData.get("academicSessionId"),
    semesterId: formData.get("semesterId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check your entries.",
    };
  }

  try {
    await createCourseAssignment(parsed.data);

    revalidatePath("/admin/academic/assignments");

    return {
      success: true,
      message: "Course successfully assigned to lecturer.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create course assignment.",
    };
  }
}

export async function deleteCourseAssignmentAction(
  formData: FormData
) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const assignmentId = String(
    formData.get("assignmentId") ?? ""
  );

  if (!assignmentId) {
    redirect(
      "/admin/academic/assignments?error=Invalid+assignment+record."
    );
  }

  let errorMessage = "";

  try {
    await deleteCourseAssignment(assignmentId);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to remove course assignment.";
  }

  if (errorMessage) {
    redirect(
      `/admin/academic/assignments?error=${encodeURIComponent(errorMessage)}`
    );
  }

  revalidatePath("/admin/academic/assignments");

  redirect(
    "/admin/academic/assignments?success=Course+assignment+removed+successfully."
  );
}
