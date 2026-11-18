/*
  Warnings:

  - Added the required column `academicLevelId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('COMPULSORY', 'ELECTIVE');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "academicLevelId" TEXT NOT NULL,
ADD COLUMN     "courseType" "CourseType" NOT NULL DEFAULT 'COMPULSORY',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Course_academicLevelId_idx" ON "Course"("academicLevelId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_academicLevelId_fkey" FOREIGN KEY ("academicLevelId") REFERENCES "AcademicLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
