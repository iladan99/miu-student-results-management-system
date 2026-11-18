
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/password";
import type {
  StudentInput,
  StudentUpdateInput,
  BulkStudentRow,
} from "@/lib/validations/student";
import { bulkStudentRowSchema } from "@/lib/validations/student";
const DEFAULT_ACCOUNT_PASSWORD = "123456";

export async function getStudentFormOptions() {
  const [departments, academicSessions, academicLevels] =
    await Promise.all([
      prisma.department.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.academicSession.findMany({
        orderBy: { startDate: "desc" },
      }),
      prisma.academicLevel.findMany({
        orderBy: { levelNumber: "asc" },
      }),
    ]);

  return { departments, academicSessions, academicLevels };
}

export async function getStudents() {
  return prisma.student.findMany({
    include: {
      user: true,
      department: true,
      academicRecords: {
        include: {
          academicSession: true,
          academicLevel: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createStudent(data: StudentInput) {
  const username = data.registrationNo.toLowerCase();

  const [
    existingStudent,
    existingUser,
    department,
    academicSession,
    academicLevel,
    studentRole,
  ] = await Promise.all([
    prisma.student.findUnique({
      where: { registrationNo: data.registrationNo },
    }),
    prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username },
        ],
      },
    }),
    prisma.department.findUnique({
      where: { id: data.departmentId },
    }),
    prisma.academicSession.findUnique({
      where: { id: data.academicSessionId },
    }),
    prisma.academicLevel.findUnique({
      where: { id: data.academicLevelId },
    }),
    prisma.role.findUnique({
      where: { name: "STUDENT" },
    }),
  ]);

  if (existingStudent) {
    throw new Error("This registration number already exists.");
  }

  if (existingUser) {
    throw new Error("This email address or username is already in use.");
  }

  if (!department) {
    throw new Error("Selected department was not found.");
  }

  if (!academicSession) {
    throw new Error("Selected academic session was not found.");
  }

  if (!academicLevel) {
    throw new Error("Selected academic level was not found.");
  }

  if (!studentRole) {
    throw new Error("Student role is not configured in the system.");
  }

  const temporaryPassword = DEFAULT_ACCOUNT_PASSWORD;
  const passwordHash = await hashPassword(temporaryPassword);

  try {
    const student = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          username,
          passwordHash,
          roleId: studentRole.id,
          isActive: true,
        },
      });

      return tx.student.create({
        data: {
          userId: user.id,
          registrationNo: data.registrationNo,
          departmentId: data.departmentId,
          admissionYear: data.admissionYear,
          academicRecords: {
            create: {
              academicSessionId: data.academicSessionId,
              academicLevelId: data.academicLevelId,
            },
          },
        },
        include: {
          user: true,
          department: true,
        },
      });
    });

    return {
      student,
      credentials: {
        username,
        password: temporaryPassword,
      },
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "A student with this registration number, email or username already exists."
      );
    }

    throw error;
  }
}

export async function updateStudent(
  id: string,
  data: StudentUpdateInput
) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!student) {
    throw new Error("Student record was not found.");
  }

  const [existingStudent, existingUser, department] = await Promise.all([
    prisma.student.findFirst({
      where: {
        registrationNo: data.registrationNo,
        NOT: { id },
      },
    }),
    prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.registrationNo.toLowerCase() },
        ],
        NOT: { id: student.userId },
      },
    }),
    prisma.department.findUnique({
      where: { id: data.departmentId },
    }),
  ]);

  if (existingStudent) {
    throw new Error("This registration number is already assigned to another student.");
  }

  if (existingUser) {
    throw new Error("This email address or username is already in use.");
  }

  if (!department) {
    throw new Error("Selected department was not found.");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: student.userId },
        data: {
          fullName: data.fullName,
          email: data.email,
          username: data.registrationNo.toLowerCase(),
        },
      });

      return tx.student.update({
        where: { id },
        data: {
          registrationNo: data.registrationNo,
          departmentId: data.departmentId,
          admissionYear: data.admissionYear,
        },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "The registration number, email address or username is already in use."
      );
    }

    throw error;
  }
}

export async function setStudentStatus(
  id: string,
  isActive: boolean
) {
  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student) {
    throw new Error("Student record was not found.");
  }

  return prisma.user.update({
    where: { id: student.userId },
    data: { isActive },
  });
}

export async function importBulkStudents(rows: unknown[]) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No student records were provided.");
  }

  if (rows.length > 100) {
    throw new Error("A maximum of 100 students can be imported per batch.");
  }

  const results: {
    row: number;
    registrationNo?: string;
    success: boolean;
    message: string;
  }[] = [];

  const credentials: {
    fullName: string;
    registrationNo: string;
    username: string;
    password: string;
  }[] = [];

  for (let index = 0; index < rows.length; index++) {
    const rowNumber = index + 2;
    const validated = bulkStudentRowSchema.safeParse(rows[index]);

    if (!validated.success) {
      results.push({
        row: rowNumber,
        success: false,
        message: validated.error.issues
          .map((issue) => issue.message)
          .join(" "),
      });
      continue;
    }

    const row: BulkStudentRow = validated.data;

    try {
      const [department, academicSession, academicLevel] =
        await Promise.all([
          prisma.department.findUnique({
            where: { code: row.departmentCode },
          }),
          prisma.academicSession.findUnique({
            where: { name: row.academicSession },
          }),
          prisma.academicLevel.findFirst({
            where: /^\d+$/.test(row.academicLevel)
              ? { levelNumber: Number(row.academicLevel) }
              : {
                  name: {
                    equals: row.academicLevel,
                    mode: "insensitive",
                  },
                },
          }),
        ]);

      if (!department) {
        throw new Error(
          `Department code "${row.departmentCode}" was not found.`
        );
      }

      if (!academicSession) {
        throw new Error(
          `Academic session "${row.academicSession}" was not found.`
        );
      }

      if (!academicLevel) {
        throw new Error(
          `Academic level "${row.academicLevel}" was not found.`
        );
      }

      const result = await createStudent({
        fullName: row.fullName,
        email: row.email,
        registrationNo: row.registrationNo,
        departmentId: department.id,
        admissionYear: row.admissionYear,
        academicSessionId: academicSession.id,
        academicLevelId: academicLevel.id,
      });

      credentials.push({
        fullName: row.fullName,
        registrationNo: row.registrationNo,
        username: result.credentials.username,
        password: result.credentials.password,
      });

      results.push({
        row: rowNumber,
        registrationNo: row.registrationNo,
        success: true,
        message: "Student registered successfully.",
      });
    } catch (error) {
      results.push({
        row: rowNumber,
        registrationNo: row.registrationNo,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to register this student.",
      });
    }
  }

  return {
    total: rows.length,
    successful: results.filter((result) => result.success).length,
    failed: results.filter((result) => !result.success).length,
    results,
    credentials,
  };
}
