
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/password";
import type {
  LecturerInput,
  LecturerUpdateInput,
} from "@/lib/validations/lecturer";
const DEFAULT_ACCOUNT_PASSWORD = "123456";

export async function getLecturerFormOptions() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });

  return { departments };
}

export async function getLecturers() {
  return prisma.lecturer.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createLecturer(data: LecturerInput) {
  const username = data.staffNumber.toLowerCase();

  const [
    existingLecturer,
    existingUser,
    department,
    lecturerRole,
  ] = await Promise.all([
    prisma.lecturer.findUnique({
      where: { staffNumber: data.staffNumber },
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
    prisma.role.findUnique({
      where: { name: "LECTURER" },
    }),
  ]);

  if (existingLecturer) {
    throw new Error("This staff number is already registered.");
  }

  if (existingUser) {
    throw new Error("This email address or username is already in use.");
  }

  if (!department) {
    throw new Error("Selected department was not found.");
  }

  if (!lecturerRole) {
    throw new Error("Lecturer role is not configured in the system.");
  }

  const temporaryPassword = DEFAULT_ACCOUNT_PASSWORD;
  const passwordHash = await hashPassword(temporaryPassword);

  try {
    const lecturer = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          username,
          passwordHash,
          roleId: lecturerRole.id,
          isActive: true,
        },
      });

      return tx.lecturer.create({
        data: {
          userId: user.id,
          staffNumber: data.staffNumber,
          departmentId: data.departmentId,
        },
        include: {
          user: true,
          department: true,
        },
      });
    });

    return {
      lecturer,
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
        "A lecturer with this staff number, email or username already exists."
      );
    }

    throw error;
  }
}

export async function updateLecturer(
  id: string,
  data: LecturerUpdateInput
) {
  const lecturer = await prisma.lecturer.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!lecturer) {
    throw new Error("Lecturer record was not found.");
  }

  const username = data.staffNumber.toLowerCase();

  const [existingLecturer, existingUser, department] =
    await Promise.all([
      prisma.lecturer.findFirst({
        where: {
          staffNumber: data.staffNumber,
          NOT: { id },
        },
      }),
      prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username },
          ],
          NOT: { id: lecturer.userId },
        },
      }),
      prisma.department.findUnique({
        where: { id: data.departmentId },
      }),
    ]);

  if (existingLecturer) {
    throw new Error(
      "This staff number is already assigned to another lecturer."
    );
  }

  if (existingUser) {
    throw new Error(
      "This email address or username is already in use."
    );
  }

  if (!department) {
    throw new Error("Selected department was not found.");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: lecturer.userId },
        data: {
          fullName: data.fullName,
          email: data.email,
          username,
        },
      });

      return tx.lecturer.update({
        where: { id },
        data: {
          staffNumber: data.staffNumber,
          departmentId: data.departmentId,
        },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "The staff number, email address or username is already in use."
      );
    }

    throw error;
  }
}

export async function setLecturerStatus(
  id: string,
  isActive: boolean
) {
  const lecturer = await prisma.lecturer.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!lecturer) {
    throw new Error("Lecturer record was not found.");
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: lecturer.userId },
      data: { isActive },
    });

    // Revoke existing sessions immediately when an account is deactivated.
    if (!isActive) {
      await tx.authSession.deleteMany({
        where: { userId: lecturer.userId },
      });
    }

    return user;
  });
}
