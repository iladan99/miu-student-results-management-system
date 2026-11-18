
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { facultySchema } from "@/lib/validations/faculty";
import {
  createFaculty,
  updateFaculty,
} from "@/services/faculty";

export type FacultyActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const allowedRoles = ["ADMIN", "ADMINISTRATOR"] as const;

export async function createFacultyAction(
  _prevState: FacultyActionState,
  formData: FormData
): Promise<FacultyActionState> {
  await requireRole([...allowedRoles]);

  const validated = facultySchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description") ?? "",
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await createFaculty(validated.data);
    revalidatePath("/admin/academic/faculties");

    return {
      success: true,
      message: "Faculty created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create faculty.",
    };
  }
}

export async function updateFacultyAction(
  _prevState: FacultyActionState,
  formData: FormData
): Promise<FacultyActionState> {
  await requireRole([...allowedRoles]);

  const id = formData.get("id");

  if (typeof id !== "string" || !id.trim()) {
    return {
      success: false,
      message: "Invalid faculty record.",
    };
  }

  const validated = facultySchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description") ?? "",
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await updateFaculty(id, validated.data);
    revalidatePath("/admin/academic/faculties");

    return {
      success: true,
      message: "Faculty updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update faculty.",
    };
  }
}
