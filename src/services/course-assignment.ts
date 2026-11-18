
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import type { CourseAssignmentInput } from "@/lib/validations/course-assignment";

export async function getCourseAssignmentFormOptions() {
  const [lecturers, courses, academicSessions] = await Promise.all([
    prisma.lecturer.findMany({
      where: {
        user: {
          isActive: true,
        },
      },
      select: {
        id: true,
        staffNumber: true,
        user: {
          select: {
            fullName: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          fullName: "asc",
        },
      },
    }),

    prisma.course.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        title: true,
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        code: "asc",
      },
    }),

    prisma.academicSession.findMany({
      include: {
        semesters: {
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "desc",
      },
    }),
  ]);

  return {
    lecturers,
    courses,
    academicSessions,
  };
}

export async function getCourseAssignments() {
  return prisma.courseAssignment.findMany({
    include: {
      lecturer: {
        include: {
          user: true,
          department: true,
        },
      },
      course: {
        include: {
          department: true,
          academicLevel: true,
        },
      },
      academicSession: true,
      semester: true,
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: [
      {
        academicSession: {
          name: "desc",
        },
      },
      {
        course: {
          code: "asc",
        },
      },
    ],
  });
}

export async function createCourseAssignment(
  data: CourseAssignmentInput
) {
  const [lecturer, course, academicSession, semester] =
    await Promise.all([
      prisma.lecturer.findUnique({
        where: {
          id: data.lecturerId,
        },
        include: {
          user: true,
        },
      }),

      prisma.course.findUnique({
        where: {
          id: data.courseId,
        },
      }),

      prisma.academicSession.findUnique({
        where: {
          id: data.academicSessionId,
        },
      }),

      prisma.semester.findFirst({
        where: {
          id: data.semesterId,
          academicSessionId: data.academicSessionId,
        },
      }),
    ]);

  if (!lecturer) {
    throw new Error("Selected lecturer was not found.");
  }

  if (!lecturer.user.isActive) {
    throw new Error("The selected lecturer account is inactive.");
  }

  if (!course) {
    throw new Error("Selected course was not found.");
  }

  if (!course.isActive) {
    throw new Error("The selected course is inactive.");
  }

  if (!academicSession) {
    throw new Error("Selected academic session was not found.");
  }

  if (!semester) {
    throw new Error(
      "The selected semester does not belong to the selected academic session."
    );
  }

  try {
    return await prisma.courseAssignment.create({
      data: {
        lecturerId: data.lecturerId,
        courseId: data.courseId,
        academicSessionId: data.academicSessionId,
        semesterId: data.semesterId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "This lecturer is already assigned to this course for the selected session and semester."
      );
    }

    throw error;
  }
}

export async function deleteCourseAssignment(id: string) {
  const assignment = await prisma.courseAssignment.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!assignment) {
    throw new Error("Course assignment was not found.");
  }

  if (assignment._count.registrations > 0) {
    throw new Error(
      "This assignment cannot be removed because students have already registered for it."
    );
  }

  return prisma.courseAssignment.delete({
    where: {
      id,
    },
  });
}
