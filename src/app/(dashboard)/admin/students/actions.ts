
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorization";
import {
  studentSchema,
  studentUpdateSchema,
} from "@/lib/validations/student";
import {
  createStudent,
  updateStudent,
  setStudentStatus,
} from "@/services/student";
import { importBulkStudents } from "@/services/student";

export type StudentActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  credentials?: {
    username: string;
    password: string;
  };
};

export async function createStudentAction(
  _prevState: StudentActionState,
  formData: FormData
): Promise<StudentActionState> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const validated = studentSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    registrationNo: formData.get("registrationNo"),
    departmentId: formData.get("departmentId"),
    admissionYear: formData.get("admissionYear"),
    academicSessionId: formData.get("academicSessionId"),
    academicLevelId: formData.get("academicLevelId"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await createStudent(validated.data);

    revalidatePath("/admin/students");
    revalidatePath("/admin/academic/departments");

    return {
      success: true,
      message: "Student registered successfully. Save the login credentials below.",
      credentials: result.credentials,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to register student.",
    };
  }
}

export async function updateStudentAction(
    _prevState: StudentActionState,
    formData: FormData
  ): Promise<StudentActionState> {
    await requireRole(["ADMIN", "ADMINISTRATOR"]);
  
    const validated = studentUpdateSchema.safeParse({
      id: formData.get("id"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      registrationNo: formData.get("registrationNo"),
      departmentId: formData.get("departmentId"),
      admissionYear: formData.get("admissionYear"),
    });
  
    if (!validated.success) {
      return {
        success: false,
        message: "Please correct the form errors.",
        errors: validated.error.flatten().fieldErrors,
      };
    }
  
    try {
      await updateStudent(validated.data.id, validated.data);
  
      revalidatePath("/admin/students");
  
      return {
        success: true,
        message: "Student record updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update student record.",
      };
    }
  }
  
  export async function setStudentStatusAction(
    formData: FormData
  ): Promise<void> {
    await requireRole(["ADMIN", "ADMINISTRATOR"]);
  
    const studentId = formData.get("studentId");
    const isActiveValue = formData.get("isActive");
  
    if (
      typeof studentId !== "string" ||
      !studentId ||
      (isActiveValue !== "true" && isActiveValue !== "false")
    ) {
      throw new Error("Invalid student account status request.");
    }
  
    await setStudentStatus(studentId, isActiveValue === "true");
  
    revalidatePath("/admin/students");
  }
  
export type BulkStudentActionState = {
  success?: boolean;
  message?: string;
  report?: {
    total: number;
    successful: number;
    failed: number;
    results: {
      row: number;
      registrationNo?: string;
      success: boolean;
      message: string;
    }[];
    credentials: {
      fullName: string;
      registrationNo: string;
      username: string;
      password: string;
    }[];
  };
};

export async function bulkImportStudentsAction(
  _prevState: BulkStudentActionState,
  formData: FormData
): Promise<BulkStudentActionState> {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const rowsValue = formData.get("rows");

  if (typeof rowsValue !== "string" || !rowsValue) {
    return {
      success: false,
      message: "No student data was received.",
    };
  }

  let rows: unknown[];

  try {
    const parsed: unknown = JSON.parse(rowsValue);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid CSV data.");
    }

    rows = parsed;
  } catch {
    return {
      success: false,
      message: "Unable to read the uploaded student data.",
    };
  }

  if (rows.length === 0 || rows.length > 100) {
    return {
      success: false,
      message: "Import between 1 and 100 student records per batch.",
    };
  }

  try {
    const report = await importBulkStudents(rows);

    revalidatePath("/admin/students");
    revalidatePath("/admin/academic/departments");

    return {
      success: true,
      message: `${report.successful} students registered successfully. ${report.failed} records failed.`,
      report,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Bulk student import failed.",
    };
  }
}
