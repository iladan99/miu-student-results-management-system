import { prisma } from "@/lib/database/prisma";
import type { AcademicLevelInput } from "@/lib/validations/academic-level";

export async function getAcademicLevels() {
  return prisma.academicLevel.findMany({
    include: {
      _count: {
        select: {
          courses: true,
          academicRecords: true,
        },
      },
    },
    orderBy: {
      levelNumber: "asc",
    },
  });
}

export async function createAcademicLevel(data: AcademicLevelInput) {
  const existing = await prisma.academicLevel.findFirst({
    where: {
      OR: [
        { name: { equals: data.name, mode: "insensitive" } },
        { levelNumber: data.levelNumber },
      ],
    },
  });

  if (existing) {
    throw new Error("An academic level with this name or number already exists.");
  }

  return prisma.academicLevel.create({
    data,
  });
}

export async function updateAcademicLevel(
  id: string,
  data: AcademicLevelInput
) {
  const existingLevel = await prisma.academicLevel.findUnique({
    where: { id },
  });

  if (!existingLevel) {
    throw new Error("Academic level not found.");
  }

  const duplicate = await prisma.academicLevel.findFirst({
    where: {
      id: { not: id },
      OR: [
        { name: { equals: data.name, mode: "insensitive" } },
        { levelNumber: data.levelNumber },
      ],
    },
  });

  if (duplicate) {
    throw new Error("Another academic level already uses this name or number.");
  }

  return prisma.academicLevel.update({
    where: { id },
    data,
  });
}