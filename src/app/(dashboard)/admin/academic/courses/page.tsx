import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getCourses, getCourseFormOptions } from "@/services/course";
import CourseForm from "./CourseForm";
import CourseTable from "./CourseTable";

export default async function CoursesPage() {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const [courses, options] = await Promise.all([
    getCourses(),
    getCourseFormOptions(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/admin/academic"
          className="text-sm text-blue-700 hover:underline"
        >
          ← Academic Administration
        </Link>

        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Course Management
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Register and manage courses by department and academic level.
        </p>
      </div>

      <CourseForm
        departments={options.departments}
        academicLevels={options.academicLevels}
      />

      <CourseTable
        courses={courses}
        departments={options.departments}
        academicLevels={options.academicLevels}
      />
    </section>
  );
}