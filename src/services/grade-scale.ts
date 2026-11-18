
import { prisma } from "@/lib/database/prisma";
import type { GradeScaleInput } from "@/lib/validations/grade-scale";

export const defaultGradeBands = [
  {
    letterGrade: "A",
    minScore: 70,
    maxScore: 100,
    gradePoint: 5,
  },
  {
    letterGrade: "B",
    minScore: 60,
    maxScore: 69,
    gradePoint: 4,
  },
  {
    letterGrade: "C",
    minScore: 50,
    maxScore: 59,
    gradePoint: 3,
  },
  {
    letterGrade: "D",
    minScore: 45,
    maxScore: 49,
    gradePoint: 2,
  },
  {
    letterGrade: "E",
    minScore: 40,
    maxScore: 44,
    gradePoint: 1,
  },
  {
    letterGrade: "F",
    minScore: 0,
    maxScore: 39,
    gradePoint: 0,
  },
];

export async function getGradeScaleConfiguration() {
  const savedBands = await prisma.gradeScale.findMany({
    where: {
      isActive: true,
    },
  });

  return defaultGradeBands.map((defaultBand) => {
    const savedBand = savedBands.find(
      (band) => band.letterGrade === defaultBand.letterGrade
    );

    return {
      ...defaultBand,
      minScore: savedBand?.minScore ?? defaultBand.minScore,
      maxScore: savedBand?.maxScore ?? defaultBand.maxScore,
      gradePoint: savedBand
        ? Number(savedBand.gradePoint)
        : defaultBand.gradePoint,
    };
  });
}

export async function saveGradeScaleConfiguration(
  data: GradeScaleInput
) {
  return prisma.$transaction(async (tx) => {
    await tx.gradeScale.deleteMany();

    await tx.gradeScale.createMany({
      data: data.bands.map((band) => ({
        letterGrade: band.letterGrade,
        minScore: band.minScore,
        maxScore: band.maxScore,
        gradePoint: band.gradePoint,
        isActive: true,
      })),
    });

    return tx.gradeScale.findMany({
      orderBy: {
        minScore: "desc",
      },
    });
  });
}
