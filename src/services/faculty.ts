
import { prisma } from "@/lib/database/prisma";
import type { FacultyInput } from "@/lib/validations/faculty";

export async function getFaculties() {
  return prisma.faculty.findMany({
    include: {
      _count: {
        select: {
          departments: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createFaculty(data: FacultyInput) {
  const [existingCode, existingName] = await Promise.all([
    prisma.faculty.findUnique({
      where: { code: data.code },
    }),
    prisma.faculty.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: "insensitive",
        },
      },
    }),
  ]);

  if (existingCode) {
    throw new Error("A faculty with this code already exists.");
  }

  if (existingName) {
    throw new Error("A faculty with this name already exists.");
  }

  return prisma.faculty.create({
    data: {
      ...data,
      description: data.description || null,
    },
  });
}

export async function updateFaculty(id: string, data: FacultyInput) {
  const [faculty, existingCode, existingName] = await Promise.all([
    prisma.faculty.findUnique({
      where: { id },
    }),
    prisma.faculty.findFirst({
      where: {
        code: data.code,
        id: { not: id },
      },
    }),
    prisma.faculty.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: "insensitive",
        },
        id: { not: id },
      },
    }),
  ]);

  if (!faculty) {
    throw new Error("Faculty not found.");
  }

  if (existingCode) {
    throw new Error("Another faculty already uses this code.");
  }

  if (existingName) {
    throw new Error("Another faculty already uses this name.");
  }

  return prisma.faculty.update({
    where: { id },
    data: {
      ...data,
      description: data.description || null,
    },
  });
}
