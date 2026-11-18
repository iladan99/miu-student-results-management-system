
import { prisma } from "@/lib/database/prisma";

export async function getReportFilterOptions() {
  const [departments, academicLevels, academicSessions, semesters, courses] =
    await Promise.all([
      prisma.department.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.academicLevel.findMany({
        orderBy: { levelNumber: "asc" },
        select: { id: true, name: true, levelNumber: true },
      }),
      prisma.academicSession.findMany({
        orderBy: { startDate: "desc" },
        select: { id: true, name: true },
      }),
      prisma.semester.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          academicSessionId: true,
        },
      }),
      prisma.course.findMany({
        orderBy: { code: "asc" },
        select: { id: true, code: true, title: true },
      }),
    ]);

  return {
    departments,
    academicLevels,
    academicSessions,
    semesters,
    courses,
  };
}

export async function getStudentReport(filters: {
  departmentId?: string;
  academicLevelId?: string;
}) {
  const students = await prisma.student.findMany({
    where: filters.departmentId
      ? { departmentId: filters.departmentId }
      : {},
    include: {
      user: true,
      department: true,
      academicRecords: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          academicLevel: true,
          academicSession: true,
        },
      },
    },
    orderBy: { registrationNo: "asc" },
  });

  const filteredStudents = filters.academicLevelId
    ? students.filter(
        (student) =>
          student.academicRecords[0]?.academicLevelId ===
          filters.academicLevelId
      )
    : students;

  return {
    students: filteredStudents,
    total: filteredStudents.length,
  };
}

export async function getLecturerReport(filters: {
  departmentId?: string;
}) {
  const lecturers = await prisma.lecturer.findMany({
    where: filters.departmentId
      ? { departmentId: filters.departmentId }
      : {},
    include: {
      user: true,
      department: true,
      courseAssignments: {
        include: {
          course: true,
          academicSession: true,
          semester: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { staffNumber: "asc" },
  });

  return {
    lecturers,
    total: lecturers.length,
  };
}

export async function getAcademicResultsReport(filters: {
  academicSessionId?: string;
  semesterId?: string;
  departmentId?: string;
  courseId?: string;
}) {
  const results = await prisma.result.findMany({
    where: {
      status: "APPROVED",
      registration: {
        is: {
          ...(filters.academicSessionId
            ? { academicSessionId: filters.academicSessionId }
            : {}),
          ...(filters.semesterId
            ? { semesterId: filters.semesterId }
            : {}),
          ...(filters.courseId
            ? { courseId: filters.courseId }
            : {}),
          ...(filters.departmentId
            ? {
                student: {
                  departmentId: filters.departmentId,
                },
              }
            : {}),
        },
      },
    },
    include: {
      registration: {
        include: {
          student: {
            include: {
              user: true,
              department: true,
            },
          },
          course: true,
          academicSession: true,
          semester: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const passCount = results.filter(
    (result) => result.letterGrade !== "F"
  ).length;

  const failCount = results.length - passCount;

  return {
    results,
    total: results.length,
    passCount,
    failCount,
  };
}
