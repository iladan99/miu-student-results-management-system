
import { prisma } from "@/lib/database/prisma";

async function getEditableRegistration(
  userId: string,
  assignmentId: string,
  registrationId: string
) {
  const assignment = await prisma.courseAssignment.findFirst({
    where: {
      id: assignmentId,
      lecturer: { userId },
    },
    select: { id: true },
  });

  if (!assignment) {
    throw new Error(
      "You are not authorised to enter scores for this course."
    );
  }

  const registration = await prisma.courseRegistration.findFirst({
    where: {
      id: registrationId,
      courseAssignmentId: assignmentId,
      status: "REGISTERED",
    },
    include: { result: true },
  });

  if (!registration) {
    throw new Error(
      "This student is not registered for this course assignment."
    );
  }

  const existingResult = registration.result;

  if (
    existingResult &&
    existingResult.status !== "DRAFT" &&
    existingResult.status !== "REJECTED"
  ) {
    throw new Error(
      "This result has already been submitted or approved and cannot be edited."
    );
  }

  return existingResult;
}

async function calculateGrade(totalScore: number) {
  const score = Math.floor(totalScore);

  const gradingScale = [
    { min: 70, max: 100, grade: "A", point: 5 },
    { min: 60, max: 69, grade: "B", point: 4 },
    { min: 50, max: 59, grade: "C", point: 3 },
    { min: 45, max: 49, grade: "D", point: 2 },
    { min: 40, max: 44, grade: "E", point: 1 },
    { min: 0, max: 39, grade: "F", point: 0 },
  ];

  const matchedGrade = gradingScale.find(
    (band) => score >= band.min && score <= band.max
  );

  if (!matchedGrade) {
    throw new Error("Unable to calculate the student's grade.");
  }

  return {
    letterGrade: matchedGrade.grade,
    gradePoint: matchedGrade.point,
  };
}

async function saveResultScores(
  userId: string,
  assignmentId: string,
  registrationId: string,
  updatedScore: number,
  scoreType: "CA" | "EXAM"
) {
  const existingResult = await getEditableRegistration(
    userId,
    assignmentId,
    registrationId
  );

  const caScore =
    scoreType === "CA"
      ? updatedScore
      : existingResult
        ? Number(existingResult.caScore)
        : 0;

  const examScore =
    scoreType === "EXAM"
      ? updatedScore
      : existingResult
        ? Number(existingResult.examScore)
        : 0;

  const totalScore = Number((caScore + examScore).toFixed(2));
  const grade = await calculateGrade(totalScore);

  return prisma.result.upsert({
    where: { registrationId },
    create: {
      registrationId,
      caScore,
      examScore,
      totalScore,
      letterGrade: grade.letterGrade,
      gradePoint: grade.gradePoint,
      status: "DRAFT",
    },
    update: {
      caScore,
      examScore,
      totalScore,
      letterGrade: grade.letterGrade,
      gradePoint: grade.gradePoint,
      status: "DRAFT",
      submittedAt: null,
      approvedAt: null,
    },
  });
}

export async function saveLecturerCAScore(
  userId: string,
  assignmentId: string,
  registrationId: string,
  caScore: number
) {
  if (!Number.isFinite(caScore) || caScore < 0 || caScore > 40) {
    throw new Error("CA score must be between 0 and 40.");
  }

  return saveResultScores(
    userId,
    assignmentId,
    registrationId,
    caScore,
    "CA"
  );
}

export async function saveLecturerExamScore(
  userId: string,
  assignmentId: string,
  registrationId: string,
  examScore: number
) {
  if (
    !Number.isFinite(examScore) ||
    examScore < 0 ||
    examScore > 60
  ) {
    throw new Error(
      "Examination score must be between 0 and 60."
    );
  }

  return saveResultScores(
    userId,
    assignmentId,
    registrationId,
    examScore,
    "EXAM"
  );
}

export async function submitLecturerCourseResults(
  userId: string,
  assignmentId: string
) {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.courseAssignment.findFirst({
      where: {
        id: assignmentId,
        lecturer: { userId },
      },
      include: {
        course: true,
        academicSession: true,
        semester: true,
        registrations: {
          where: { status: "REGISTERED" },
          include: { result: true },
        },
      },
    });

    if (!assignment) {
      throw new Error(
        "You are not authorised to submit results for this course."
      );
    }

    const registrations = assignment.registrations;

    if (registrations.length === 0) {
      throw new Error(
        "There are no registered students for this course."
      );
    }

    const missingResults = registrations.filter(
      (registration) => !registration.result
    );

    if (missingResults.length > 0) {
      throw new Error(
        `${missingResults.length} registered student(s) still have no saved result. Complete their scores before submission.`
      );
    }

    const eligibleResults = registrations
      .map((registration) => registration.result!)
      .filter(
        (result) =>
          result.status === "DRAFT" ||
          result.status === "REJECTED"
      );

    if (eligibleResults.length === 0) {
      throw new Error(
        "There are no draft or rejected results waiting for submission."
      );
    }

    const resultIds = eligibleResults.map((result) => result.id);

    const update = await tx.result.updateMany({
      where: {
        id: { in: resultIds },
        status: { in: ["DRAFT", "REJECTED"] },
      },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        approvedAt: null,
      },
    });

    if (update.count !== eligibleResults.length) {
      throw new Error(
        "Some results changed during submission. Refresh the page and try again."
      );
    }

    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: "RESULTS_SUBMITTED",
        entity: "CourseAssignment",
        entityId: assignment.id,
        details: {
          courseCode: assignment.course.code,
          courseTitle: assignment.course.title,
          academicSession: assignment.academicSession.name,
          semester: assignment.semester.name,
          submittedCount: update.count,
          resultIds,
        },
      },
    });

    return { submittedCount: update.count };
  });
}

export async function getSubmittedCourseAssignments() {
  return prisma.courseAssignment.findMany({
    where: {
      registrations: {
        some: {
          status: "REGISTERED",
          result: {
            is: {
              status: "SUBMITTED",
            },
          },
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
      academicSession: true,
      semester: true,
      registrations: {
        where: {
          status: "REGISTERED",
        },
        include: {
          result: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCourseResultsForReview(
  assignmentId: string
) {
  return prisma.courseAssignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      course: true,
      lecturer: {
        include: {
          user: true,
        },
      },
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
}

export async function reviewCourseResults(
  adminId: string,
  assignmentId: string,
  decision: "APPROVED" | "REJECTED",
  comments?: string
) {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.courseAssignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: true,
        academicSession: true,
        semester: true,
        registrations: {
          where: {
            status: "REGISTERED",
          },
          include: {
            result: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new Error("Course assignment not found.");
    }

    const registrations = assignment.registrations;

    if (registrations.length === 0) {
      throw new Error("There are no registered students for this course.");
    }

    const incompleteResults = registrations.filter(
      (registration) =>
        !registration.result ||
        registration.result.status !== "SUBMITTED"
    );

    if (incompleteResults.length > 0) {
      throw new Error(
        "Not all registered student results are submitted. The course cannot be reviewed."
      );
    }

    if (decision === "REJECTED" && !comments?.trim()) {
      throw new Error(
        "Please provide a reason for rejecting these results."
      );
    }

    const resultIds = registrations.map(
      (registration) => registration.result!.id
    );

    const update = await tx.result.updateMany({
      where: {
        id: {
          in: resultIds,
        },
        status: "SUBMITTED",
      },
      data: {
        status: decision,
        approvedAt:
          decision === "APPROVED" ? new Date() : null,
      },
    });

    if (update.count !== resultIds.length) {
      throw new Error(
        "Some results have changed. Refresh the page and try again."
      );
    }

    await tx.resultApproval.createMany({
      data: resultIds.map((resultId) => ({
        resultId,
        approverId: adminId,
        decision,
        comments: comments?.trim() || null,
      })),
    });

    await tx.auditLog.create({
      data: {
        actorId: adminId,
        action:
          decision === "APPROVED"
            ? "COURSE_RESULTS_APPROVED"
            : "COURSE_RESULTS_REJECTED",
        entity: "CourseAssignment",
        entityId: assignment.id,
        details: {
          courseCode: assignment.course.code,
          academicSession: assignment.academicSession.name,
          semester: assignment.semester.name,
          decision,
          comments: comments?.trim() || null,
          resultCount: update.count,
        },
      },
    });

    return {
      decision,
      resultCount: update.count,
    };
  });
}
