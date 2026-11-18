
import { prisma } from "@/lib/database/prisma";
import type { DepartmentInput } from "@/lib/validations/department";

export async function getDepartments() {
  return prisma.department.findMany({
    include: {
      faculty: true,
      _count: {
        select: {
          students: true,
          lecturers: true,
          courses: true,
        },
      },
    },
    orderBy: [
      { faculty: { name: "asc" } },
      { name: "asc" },
    ],
  });
}

export async function getFacultiesForDepartments() {
  return prisma.faculty.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function createDepartment(data: DepartmentInput) {
  const faculty = await prisma.faculty.findUnique({
    where: { id: data.facultyId },
  });

  if (!faculty) {
    throw new Error("Selected faculty does not exist.");
  }

  const existingDepartment = await prisma.department.findFirst({
    where: {
      OR: [
        { code: data.code },
        {
          name: {
            equals: data.name,
            mode: "insensitive",
          },
          facultyId: data.facultyId,
        },
      ],
    },
  });

  if (existingDepartment) {
    throw new Error(
      "A department with this code already exists, or this name is already registered under the selected faculty."
    );
  }

  return prisma.department.create({
    data: {
      name: data.name,
      code: data.code,
      facultyId: data.facultyId,
    },
  });
}

export async function updateDepartment(
  id: string,
  data: DepartmentInput
) {
  const existingDepartment = await prisma.department.findUnique({
    where: { id },
  });

  if (!existingDepartment) {
    throw new Error("Department not found.");
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: data.facultyId },
  });

  if (!faculty) {
    throw new Error("Selected faculty does not exist.");
  }

  const duplicateDepartment = await prisma.department.findFirst({
    where: {
      OR: [
        { code: data.code },
        {
          name: {
            equals: data.name,
            mode: "insensitive",
          },
          facultyId: data.facultyId,
        },
      ],
      NOT: { id },
    },
  });

  if (duplicateDepartment) {
    throw new Error(
      "Another department already uses this code or name under the selected faculty."
    );
  }

  return prisma.department.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
      facultyId: data.facultyId,
    },
  });
}
