
import { prisma } from "@/lib/database/prisma";

export async function getLecturerDashboardData(userId: string) {
  const lecturer = await prisma.lecturer.findUnique({
    where: { userId },
    include: {
      department: true,
      courseAssignments: {
        include: {
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
              registrations: {
                where: {
                  status: "REGISTERED",
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!lecturer) {
    throw new Error(
      "Your lecturer profile could not be found. Please contact the administrator."
    );
  }

  const assignments = lecturer.courseAssignments;

  return {
    lecturer: {
      fullName: lecturer.userId,
      staffNumber: lecturer.staffNumber,
      department: lecturer.department.name,
    },
    assignments,
    totalCourses: assignments.length,
    totalStudents: assignments.reduce(
      (total, assignment) =>
        total + assignment._count.registrations,
      0
    ),
  };
}
