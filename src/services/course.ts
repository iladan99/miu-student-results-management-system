
import { prisma } from "@/lib/database/prisma";
import type { CourseInput } from "@/lib/validations/course";

export async function getCourses() {
  return prisma.course.findMany({
    include: {
      department: true,
      academicLevel: true,
      _count: {
        select: {
          assignments: true,
          registrations: true,
        },
      },
    },
    orderBy: [
      { department: { name: "asc" } },
      { code: "asc" },
    ],
  });
}

export async function getCourseFormOptions() {
  const [departments, academicLevels] = await Promise.all([
    prisma.department.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.academicLevel.findMany({
      orderBy: { levelNumber: "asc" },
    }),
  ]);

  return {
    departments,
    academicLevels,
  };
}

export async function createCourse(data: CourseInput) {
  const [department, academicLevel, existingCourse] = await Promise.all([
    prisma.department.findUnique({
      where: { id: data.departmentId },
    }),
    prisma.academicLevel.findUnique({
      where: { id: data.academicLevelId },
    }),
    prisma.course.findUnique({
      where: { code: data.code },
    }),
  ]);

  if (!department) throw new Error("Selected department was not found.");
  if (!academicLevel) throw new Error("Selected academic level was not found.");
  if (existingCourse) throw new Error("A course with this code already exists.");

  return prisma.course.create({
    data: {
      ...data,
      description: data.description || null,
    },
  });
}

export async function updateCourse(id: string, data: CourseInput) {
  const [course, department, academicLevel, duplicate] = await Promise.all([
    prisma.course.findUnique({ where: { id } }),
    prisma.department.findUnique({ where: { id: data.departmentId } }),
    prisma.academicLevel.findUnique({ where: { id: data.academicLevelId } }),
    prisma.course.findFirst({
      where: {
        code: data.code,
        id: { not: id },
      },
    }),
  ]);

  if (!course) throw new Error("Course not found.");
  if (!department) throw new Error("Selected department was not found.");
  if (!academicLevel) throw new Error("Selected academic level was not found.");
  if (duplicate) throw new Error("Another course already uses this course code.");

  return prisma.course.update({
    where: { id },
    data: {
      ...data,
      description: data.description || null,
    },
  });
}

export async function setCourseStatus(id: string, isActive: boolean) {
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) throw new Error("Course not found.");

  return prisma.course.update({
    where: { id },
    data: { isActive },
  });
}
