
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import { departmentSchema } from "@/lib/validations/department";
import {
  createDepartment,
  updateDepartment,
} from "@/services/department";

export type DepartmentActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const allowedRoles = ["ADMIN", "ADMINISTRATOR"] as const;

export async function createDepartmentAction(
  _prevState: DepartmentActionState,
  formData: FormData
): Promise<DepartmentActionState> {
  await requireRole([...allowedRoles]);

  const validated = departmentSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    facultyId: formData.get("facultyId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await createDepartment(validated.data);
    revalidatePath("/admin/academic/departments");

    return {
      success: true,
      message: "Department created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create department.",
    };
  }
}

export async function updateDepartmentAction(
  _prevState: DepartmentActionState,
  formData: FormData
): Promise<DepartmentActionState> {
  await requireRole([...allowedRoles]);

  const id = formData.get("id");

  if (typeof id !== "string" || !id.trim()) {
    return {
      success: false,
      message: "Invalid department record.",
    };
  }

  const validated = departmentSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    facultyId: formData.get("facultyId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await updateDepartment(id, validated.data);
    revalidatePath("/admin/academic/departments");

    return {
      success: true,
      message: "Department updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update department.",
    };
  }
}
