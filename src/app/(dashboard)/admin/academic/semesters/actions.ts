
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { semesterSchema } from "@/lib/validations/semester";
import {
  createSemester,
  updateSemester,
} from "@/services/semester";

export type SemesterActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const allowedRoles = ["ADMIN", "ADMINISTRATOR"] as const;

export async function createSemesterAction(
  _prevState: SemesterActionState,
  formData: FormData
): Promise<SemesterActionState> {
  await requireRole([...allowedRoles]);

  const validated = semesterSchema.safeParse({
    name: formData.get("name"),
    academicSessionId: formData.get("academicSessionId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await createSemester(validated.data);
    revalidatePath("/admin/academic/semesters");

    return {
      success: true,
      message: "Semester created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Unable to create semester.",
    };
  }
}

export async function updateSemesterAction(
  _prevState: SemesterActionState,
  formData: FormData
): Promise<SemesterActionState> {
  await requireRole([...allowedRoles]);

  const id = formData.get("id");

  if (typeof id !== "string" || !id.trim()) {
    return {
      success: false,
      message: "Invalid semester.",
    };
  }

  const validated = semesterSchema.safeParse({
    name: formData.get("name"),
    academicSessionId: formData.get("academicSessionId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await updateSemester(id, validated.data);
    revalidatePath("/admin/academic/semesters");

    return {
      success: true,
      message: "Semester updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Unable to update semester.",
    };
  }
}
