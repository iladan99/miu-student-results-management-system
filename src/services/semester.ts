import { prisma } from "@/lib/database/prisma";
import type { SemesterInput } from "@/lib/validations/semester";

export async function getSemesters() {
  return prisma.semester.findMany({
    include: {
      academicSession: true,
      _count: {
        select: {
          courseAssignments: true,
          registrations: true,
        },
      },
    },
    orderBy: [
      { academicSession: { startDate: "desc" } },
      { name: "asc" },
    ],
  });
}

export async function getAcademicSessionsForSemester() {
  return prisma.academicSession.findMany({
    orderBy: { startDate: "desc" },
  });
}

export async function createSemester(data: SemesterInput) {
  const session = await prisma.academicSession.findUnique({
    where: { id: data.academicSessionId },
  });

  if (!session) {
    throw new Error("Selected academic session does not exist.");
  }

  const existingSemester = await prisma.semester.findUnique({
    where: {
      name_academicSessionId: {
        name: data.name,
        academicSessionId: data.academicSessionId,
      },
    },
  });

  if (existingSemester) {
    throw new Error(
      "This semester already exists for the selected academic session."
    );
  }

  return prisma.semester.create({
    data: {
      name: data.name,
      academicSessionId: data.academicSessionId,
    },
  });
}

export async function updateSemester(id: string, data: SemesterInput) {
  const existingSemester = await prisma.semester.findUnique({
    where: { id },
  });

  if (!existingSemester) {
    throw new Error("Semester not found.");
  }

  const session = await prisma.academicSession.findUnique({
    where: { id: data.academicSessionId },
  });

  if (!session) {
    throw new Error("Selected academic session does not exist.");
  }

  const duplicateSemester = await prisma.semester.findFirst({
    where: {
      name: data.name,
      academicSessionId: data.academicSessionId,
      NOT: { id },
    },
  });

  if (duplicateSemester) {
    throw new Error(
      "Another semester with this name already exists for the selected session."
    );
  }

  return prisma.semester.update({
    where: { id },
    data: {
      name: data.name,
      academicSessionId: data.academicSessionId,
    },
  });
}