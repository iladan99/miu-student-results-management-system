
"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { registerStudentForCourse } from "@/services/course-registration";

export async function registerForCourseAction(formData: FormData) {
  const user = await requireRole(["STUDENT"]);

  const assignmentId = String(formData.get("assignmentId") ?? "").trim();

  if (!assignmentId) {
    redirect("/student/course-registration?status=invalid");
  }

  const result = await registerStudentForCourse(user.id, assignmentId);

  const status = result.success ? "success" : "error";

  const message = encodeURIComponent(result.message);

  const semesterQuery = result.semesterId
    ? `&semester=${encodeURIComponent(result.semesterId)}`
    : "";

  redirect(
    `/student/course-registration?status=${status}&message=${message}${semesterQuery}`,
  );
}
