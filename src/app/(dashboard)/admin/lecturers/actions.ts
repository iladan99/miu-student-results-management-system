
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import {
  lecturerSchema,
  lecturerUpdateSchema,
} from "@/lib/validations/lecturer";
import {
  createLecturer,
  updateLecturer,
  setLecturerStatus,
} from "@/services/lecturer";

export type LecturerActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  credentials?: {
    username: string;
    password: string;
  };
};

export async function createLecturerAction(
  _prevState: LecturerActionState,
  formData: FormData
): Promise<LecturerActionState> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const validated = lecturerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    staffNumber: formData.get("staffNumber"),
    departmentId: formData.get("departmentId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await createLecturer(validated.data);

    revalidatePath("/admin/lecturers");

    return {
      success: true,
      message:
        "Lecturer registered successfully. Save the login credentials below.",
      credentials: result.credentials,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to register lecturer.",
    };
  }
}

export async function updateLecturerAction(
  _prevState: LecturerActionState,
  formData: FormData
): Promise<LecturerActionState> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const validated = lecturerUpdateSchema.safeParse({
    id: formData.get("id"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    staffNumber: formData.get("staffNumber"),
    departmentId: formData.get("departmentId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await updateLecturer(validated.data.id, validated.data);

    revalidatePath("/admin/lecturers");

    return {
      success: true,
      message: "Lecturer record updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update lecturer record.",
    };
  }
}

export async function setLecturerStatusAction(
  formData: FormData
): Promise<void> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const lecturerId = formData.get("lecturerId");
  const isActiveValue = formData.get("isActive");

  if (
    typeof lecturerId !== "string" ||
    !lecturerId ||
    (isActiveValue !== "true" && isActiveValue !== "false")
  ) {
    throw new Error("Invalid lecturer account status request.");
  }

  await setLecturerStatus(
    lecturerId,
    isActiveValue === "true"
  );

  revalidatePath("/admin/lecturers");
}
