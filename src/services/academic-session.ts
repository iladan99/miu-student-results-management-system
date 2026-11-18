
import { prisma } from "@/lib/database/prisma";
import type { AcademicSessionInput } from "@/lib/validations/academic-session";

export async function getAcademicSessions() {
  return prisma.academicSession.findMany({
    orderBy: {
      startDate: "desc",
    },
    include: {
      semesters: true,
      _count: {
        select: {
          academicRecords: true,
          courseAssignments: true,
        },
      },
    },
  });
}

export async function createAcademicSession(
  data: AcademicSessionInput
) {
  const existingSession = await prisma.academicSession.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingSession) {
    throw new Error("An academic session with this name already exists.");
  }

  return prisma.academicSession.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
}

export async function updateAcademicSession(
  id: string,
  data: AcademicSessionInput
) {
  const existingSession = await prisma.academicSession.findUnique({
    where: { id },
  });

  if (!existingSession) {
    throw new Error("Academic session not found.");
  }

  const duplicateSession = await prisma.academicSession.findFirst({
    where: {
      name: data.name,
      NOT: { id },
    },
  });

  if (duplicateSession) {
    throw new Error("Another academic session already uses this name.");
  }

  return prisma.academicSession.update({
    where: { id },
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
}

export async function activateAcademicSession(id: string) {
  return prisma.$transaction(async (transaction) => {
    const session = await transaction.academicSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new Error("Academic session not found.");
    }

    await transaction.academicSession.updateMany({
      data: { isCurrent: false },
    });

    return transaction.academicSession.update({
      where: { id },
      data: { isCurrent: true },
    });
  });
}
