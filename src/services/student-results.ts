
import { prisma } from "@/lib/database/prisma";

export async function getStudentResults(userId: string) {
  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      registrationNo: true,
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
  });

  if (!student) {
    return null;
  }

  const registrations = await prisma.courseRegistration.findMany({
    where: {
      studentId: student.id,
      result: {
        is: {
          status: "APPROVED",
        },
      },
    },
    include: {
      course: true,
      academicSession: true,
      semester: true,
      result: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    student,
    registrations,
  };
}
