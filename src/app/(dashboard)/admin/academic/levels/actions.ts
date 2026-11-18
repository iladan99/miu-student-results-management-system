"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { academicLevelSchema } from "@/lib/validations/academic-level";
import {
  createAcademicLevel,
  updateAcademicLevel,
} from "@/services/academic-level";

export async function createAcademicLevelAction(formData: FormData) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const parsed = academicLevelSchema.safeParse({
    name: formData.get("name"),
    levelNumber: formData.get("levelNumber"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid academic level details.",
    };
  }

  try {
    await createAcademicLevel(parsed.data);
    revalidatePath("/admin/academic/levels");

    return {
      success: true,
      message: "Academic level created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create academic level.",
    };
  }
}

export async function updateAcademicLevelAction(
  id: string,
  formData: FormData
) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const parsed = academicLevelSchema.safeParse({
    name: formData.get("name"),
    levelNumber: formData.get("levelNumber"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid academic level details.",
    };
  }

  try {
    await updateAcademicLevel(id, parsed.data);
    revalidatePath("/admin/academic/levels");

    return {
      success: true,
      message: "Academic level updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update academic level.",
    };
  }
}