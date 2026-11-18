
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { courseSchema } from "@/lib/validations/course";
import {
  createCourse,
  updateCourse,
  setCourseStatus,
} from "@/services/course";

const COURSE_PATH = "/admin/academic/courses";

export async function createCourseAction(formData: FormData) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const parsed = courseSchema.safeParse({
    code: formData.get("code"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    creditUnits: formData.get("creditUnits"),
    departmentId: formData.get("departmentId"),
    academicLevelId: formData.get("academicLevelId"),
    courseType: formData.get("courseType"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid course details.",
    };
  }

  try {
    await createCourse(parsed.data);
    revalidatePath(COURSE_PATH);

    return { success: true, message: "Course created successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to create course.",
    };
  }
}

export async function updateCourseAction(id: string, formData: FormData) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const parsed = courseSchema.safeParse({
    code: formData.get("code"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    creditUnits: formData.get("creditUnits"),
    departmentId: formData.get("departmentId"),
    academicLevelId: formData.get("academicLevelId"),
    courseType: formData.get("courseType"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid course details.",
    };
  }

  try {
    await updateCourse(id, parsed.data);
    revalidatePath(COURSE_PATH);

    return { success: true, message: "Course updated successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to update course.",
    };
  }
}

export async function setCourseStatusAction(id: string, isActive: boolean) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  try {
    await setCourseStatus(id, isActive);
    revalidatePath(COURSE_PATH);

    return {
      success: true,
      message: isActive ? "Course activated." : "Course deactivated.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to update course status.",
    };
  }
}
