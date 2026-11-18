
import { prisma } from "@/lib/database/prisma";

export async function getLecturerCourseStudents(
  userId: string,
  assignmentId: string
) {
  const assignment = await prisma.courseAssignment.findFirst({
    where: {
      id: assignmentId,
      lecturer: {
        userId,
      },
    },
    include: {
      course: true,
      academicSession: true,
      semester: true,
      registrations: {
        where: {
          status: "REGISTERED",
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          student: {
            include: {
              user: true,
              department: true,
            },
          },
          result: true,
        },
      },
    },
  });

  if (!assignment) {
    return null;
  }

  return assignment;
}
