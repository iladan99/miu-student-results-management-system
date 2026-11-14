
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  const lecturerPassword = process.env.LECTURER_SEED_PASSWORD;
  const studentPassword = process.env.STUDENT_SEED_PASSWORD;

  if (!adminPassword || !lecturerPassword || !studentPassword) {
    throw new Error(
      "Set ADMIN_SEED_PASSWORD, LECTURER_SEED_PASSWORD and STUDENT_SEED_PASSWORD in .env before seeding."
    );
  }

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMINISTRATOR" },
    update: {},
    create: {
      name: "ADMINISTRATOR",
      description: "System administrator",
    },
  });

  const lecturerRole = await prisma.role.upsert({
    where: { name: "LECTURER" },
    update: {},
    create: {
      name: "LECTURER",
      description: "Academic lecturer",
    },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "STUDENT" },
    update: {},
    create: {
      name: "STUDENT",
      description: "Registered student",
    },
  });

  const faculty = await prisma.faculty.upsert({
    where: { code: "FCOM" },
    update: {},
    create: {
      name: "Faculty of Computing",
      code: "FCOM",
    },
  });

  const department = await prisma.department.upsert({
    where: { code: "SWE" },
    update: {},
    create: {
      name: "Software Engineering",
      code: "SWE",
      facultyId: faculty.id,
    },
  });

  const levels = [
    { name: "100 Level", levelNumber: 100 },
    { name: "200 Level", levelNumber: 200 },
    { name: "300 Level", levelNumber: 300 },
    { name: "400 Level", levelNumber: 400 },
  ];

  for (const level of levels) {
    await prisma.academicLevel.upsert({
      where: { levelNumber: level.levelNumber },
      update: {},
      create: level,
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@miu-demo.edu" },
    update: {
      passwordHash: await hashPassword(adminPassword),
      roleId: adminRole.id,
      isActive: true,
    },
    create: {
      fullName: "System Administrator",
      email: "admin@miu-demo.edu",
      username: "admin",
      passwordHash: await hashPassword(adminPassword),
      roleId: adminRole.id,
    },
  });

  const lecturer = await prisma.user.upsert({
    where: { email: "lecturer@miu-demo.edu" },
    update: {
      passwordHash: await hashPassword(lecturerPassword),
      roleId: lecturerRole.id,
      isActive: true,
    },
    create: {
      fullName: "Demo Lecturer",
      email: "lecturer@miu-demo.edu",
      username: "lecturer",
      passwordHash: await hashPassword(lecturerPassword),
      roleId: lecturerRole.id,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@miu-demo.edu" },
    update: {
      passwordHash: await hashPassword(studentPassword),
      roleId: studentRole.id,
      isActive: true,
    },
    create: {
      fullName: "Demo Student",
      email: "student@miu-demo.edu",
      username: "student",
      passwordHash: await hashPassword(studentPassword),
      roleId: studentRole.id,
    },
  });

  await prisma.lecturer.upsert({
    where: { userId: lecturer.id },
    update: { departmentId: department.id },
    create: {
      userId: lecturer.id,
      staffNumber: "MIU-DEMO-STAFF-001",
      departmentId: department.id,
    },
  });

  await prisma.student.upsert({
    where: { userId: student.id },
    update: { departmentId: department.id },
    create: {
      userId: student.id,
      registrationNo: "MIU-DEMO-2026-001",
      departmentId: department.id,
      admissionYear: 2026,
    },
  });

  console.log("Demonstration accounts created successfully.");
  console.log("Administrator: admin@miu-demo.edu");
  console.log("Lecturer: lecturer@miu-demo.edu");
  console.log("Student: student@miu-demo.edu");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
