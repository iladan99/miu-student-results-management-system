
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { academicSessionSchema } from "@/lib/validations/academic-session";
import {
  createAcademicSession,
  updateAcademicSession,
  activateAcademicSession,
} from "@/services/academic-session";

export type AcademicSessionActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const allowedRoles = ["ADMIN", "ADMINISTRATOR"] as const;

export async function createSessionAction(
  _prevState: AcademicSessionActionState,
  formData: FormData
): Promise<AcademicSessionActionState> {
  await requireRole([...allowedRoles]);

  const validated = academicSessionSchema.safeParse({
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await createAcademicSession(validated.data);
    revalidatePath("/admin/academic/sessions");

    return {
      success: true,
      message: "Academic session created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create academic session.",
    };
  }
}

export async function updateSessionAction(
  _prevState: AcademicSessionActionState,
  formData: FormData
): Promise<AcademicSessionActionState> {
  await requireRole([...allowedRoles]);

  const id = formData.get("id");

  if (typeof id !== "string" || !id.trim()) {
    return {
      success: false,
      message: "Invalid academic session.",
    };
  }

  const validated = academicSessionSchema.safeParse({
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await updateAcademicSession(id, validated.data);
    revalidatePath("/admin/academic/sessions");

    return {
      success: true,
      message: "Academic session updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update academic session.",
    };
  }
}

export async function activateSessionAction(formData: FormData) {
  await requireRole([...allowedRoles]);

  const id = formData.get("id");

  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Invalid academic session.");
  }

  await activateAcademicSession(id);
  revalidatePath("/admin/academic/sessions");
  revalidatePath("/admin");
}
