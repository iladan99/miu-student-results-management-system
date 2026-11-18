
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

export async function getStudentCourseRegistrationData(
  userId: string,
  requestedSemesterId?: string,
) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      department: true,
      academicRecords: {
        where: {
          academicSession: {
            isCurrent: true,
          },
        },
        include: {
          academicSession: {
            include: {
              semesters: true,
            },
          },
          academicLevel: true,
        },
      },
    },
  });

  if (!student) {
    return null;
  }

  const academicRecord = student.academicRecords[0];

  if (!academicRecord) {
    return {
      student,
      academicRecord: null,
      academicSession: null,
      semesters: [],
      selectedSemester: null,
      availableCourses: [],
      registrations: [],
    };
  }

  const academicSession = academicRecord.academicSession;
  const semesters = academicSession.semesters;

  const selectedSemester =
    semesters.find((semester) => semester.id === requestedSemesterId) ??
    semesters[0] ??
    null;

  if (!selectedSemester) {
    return {
      student,
      academicRecord,
      academicSession,
      semesters,
      selectedSemester: null,
      availableCourses: [],
      registrations: [],
    };
  }

  const [assignments, registrations] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: {
        academicSessionId: academicSession.id,
        semesterId: selectedSemester.id,
        course: {
          isActive: true,
          departmentId: student.departmentId,
          academicLevelId: academicRecord.academicLevelId,
        },
        lecturer: {
          user: {
            isActive: true,
          },
        },
      },
      include: {
        course: true,
        lecturer: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        course: {
          code: "asc",
        },
      },
    }),
    prisma.courseRegistration.findMany({
      where: {
        studentId: student.id,
        academicSessionId: academicSession.id,
        semesterId: selectedSemester.id,
      },
      include: {
        course: true,
        courseAssignment: {
          include: {
            lecturer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        course: {
          code: "asc",
        },
      },
    }),
  ]);

  const groupedCourses = new Map<
    string,
    {
      course: (typeof assignments)[number]["course"];
      assignments: typeof assignments;
    }
  >();

  for (const assignment of assignments) {
    const existing = groupedCourses.get(assignment.courseId);

    if (existing) {
      existing.assignments.push(assignment);
    } else {
      groupedCourses.set(assignment.courseId, {
        course: assignment.course,
        assignments: [assignment],
      });
    }
  }

  return {
    student,
    academicRecord,
    academicSession,
    semesters,
    selectedSemester,
    availableCourses: Array.from(groupedCourses.values()),
    registrations,
  };
}

export async function registerStudentForCourse(
  userId: string,
  assignmentId: string,
) {
  try {
    return await prisma.$transaction(async (transaction) => {
      const student = await transaction.student.findUnique({
        where: { userId },
      });

      if (!student) {
        return {
          success: false,
          message: "Student record was not found.",
          semesterId: "",
        };
      }

      const assignment = await transaction.courseAssignment.findUnique({
        where: { id: assignmentId },
        include: {
          course: true,
          lecturer: {
            include: {
              user: true,
            },
          },
          academicSession: true,
          semester: true,
        },
      });

      if (!assignment) {
        return {
          success: false,
          message: "The selected course assignment was not found.",
          semesterId: "",
        };
      }

      const semesterId = assignment.semesterId;

      if (!assignment.academicSession.isCurrent) {
        return {
          success: false,
          message: "Registration is only available for the current academic session.",
          semesterId,
        };
      }

      if (
        assignment.semester.academicSessionId !==
        assignment.academicSessionId
      ) {
        return {
          success: false,
          message: "The selected semester does not belong to this academic session.",
          semesterId,
        };
      }

      if (
        !assignment.course.isActive ||
        !assignment.lecturer.user.isActive
      ) {
        return {
          success: false,
          message: "This course or lecturer is no longer available.",
          semesterId,
        };
      }

      if (assignment.course.departmentId !== student.departmentId) {
        return {
          success: false,
          message: "This course is not available to your department.",
          semesterId,
        };
      }

      const academicRecord =
        await transaction.studentAcademicRecord.findUnique({
          where: {
            studentId_academicSessionId: {
              studentId: student.id,
              academicSessionId: assignment.academicSessionId,
            },
          },
        });

      if (
        !academicRecord ||
        academicRecord.academicLevelId !==
          assignment.course.academicLevelId
      ) {
        return {
          success: false,
          message: "This course is not available for your current academic level.",
          semesterId,
        };
      }

      const existingRegistration =
        await transaction.courseRegistration.findUnique({
          where: {
            studentId_courseId_academicSessionId_semesterId: {
              studentId: student.id,
              courseId: assignment.courseId,
              academicSessionId: assignment.academicSessionId,
              semesterId: assignment.semesterId,
            },
          },
        });

      if (existingRegistration?.status === "COMPLETED") {
        return {
          success: false,
          message: "This course has already been completed and cannot be registered again.",
          semesterId,
        };
      }

      if (existingRegistration?.status === "REGISTERED") {
        return {
          success: false,
          message: "You have already registered for this course.",
          semesterId,
        };
      }

      if (existingRegistration?.status === "DROPPED") {
        await transaction.courseRegistration.update({
          where: {
            id: existingRegistration.id,
          },
          data: {
            status: "REGISTERED",
            courseAssignmentId: assignment.id,
          },
        });

        return {
          success: true,
          message: "Your previous course registration has been restored.",
          semesterId,
        };
      }

      await transaction.courseRegistration.create({
        data: {
          studentId: student.id,
          courseId: assignment.courseId,
          academicSessionId: assignment.academicSessionId,
          semesterId: assignment.semesterId,
          courseAssignmentId: assignment.id,
          status: "REGISTERED",
        },
      });

      return {
        success: true,
        message: "Course registered successfully.",
        semesterId,
      };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "You have already registered for this course.",
        semesterId: "",
      };
    }

    console.error("Course registration error:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      semesterId: "",
    };
  }
}
