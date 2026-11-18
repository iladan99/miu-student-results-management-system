
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";

const managementSections = [
  {
    title: "Academic Sessions",
    description: "Create, edit and activate academic sessions.",
    href: "/admin/academic/sessions",
  },
  {
    title: "Semesters",
    description: "Manage semesters within academic sessions.",
    href: "/admin/academic/semesters",
  },
  {
    title: "Faculties",
    description: "Create and manage university faculties.",
    href: "/admin/academic/faculties",
  },
  {
    title: "Departments",
    description: "Create departments and assign them to faculties.",
    href: "/admin/academic/departments",
  },
  {
    title: "Academic Levels",
    description: "Create and manage academic levels.",
    href: "/admin/academic/levels",
  },
  {
    title: "Courses",
    description:
      "Register and manage courses by department and academic level.",
    href: "/admin/academic/courses",
  },
  {
    title: "Course Assignments",
    description:
      "Assign courses to lecturers for academic sessions and semesters.",
    href: "/admin/academic/assignments",
  },
];

export default async function AdminDashboard() {
  const user = await requireRole(["ADMIN", "ADMINISTRATOR"]);

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Administrator Dashboard
        </h2>

        <p className="mt-2 text-slate-600">
          Welcome, {user.fullName}.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Manage students, lecturers, academic sessions, courses and results
          from this dashboard.
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Academic Administration
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {managementSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h4 className="font-semibold text-slate-900">
                {section.title}
              </h4>

              <p className="mt-2 text-sm text-slate-600">
                {section.description}
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-blue-700">
                Manage section →
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div>
  <h3 className="mb-4 text-lg font-semibold text-slate-900">
    Result Management
  </h3>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Link
      href="/admin/results"
      className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
    >
      <h4 className="font-semibold text-slate-900">
        Result Approval
      </h4>

      <p className="mt-2 text-sm text-slate-600">
        Review, approve or reject results submitted by lecturers.
      </p>

      <span className="mt-4 inline-block text-sm font-medium text-blue-700">
        Review results →
      </span>
    </Link>
  </div>
</div>


<div>
  <h3 className="mb-4 text-lg font-semibold text-slate-900">
    Reports
  </h3>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Link
      href="/admin/reports/students"
      className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
    >
      <h4 className="font-semibold text-slate-900">
        Student Reports
      </h4>
      <p className="mt-2 text-sm text-slate-600">
        View registered students and filter by department and academic level.
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-blue-700">
        View report →
      </span>
    </Link>

    <Link
      href="/admin/reports/lecturers"
      className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
    >
      <h4 className="font-semibold text-slate-900">
        Lecturer Reports
      </h4>
      <p className="mt-2 text-sm text-slate-600">
        View registered lecturers, departments and assigned courses.
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-blue-700">
        View report →
      </span>
    </Link>

    <Link
      href="/admin/reports/results"
      className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
    >
      <h4 className="font-semibold text-slate-900">
        Academic Results Reports
      </h4>
      <p className="mt-2 text-sm text-slate-600">
        Review approved results and filter by session, semester, department and course.
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-blue-700">
        View report →
      </span>
    </Link>
  </div>
</div>


      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Student Administration
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/students"
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h4 className="font-semibold text-slate-900">
              Student Management
            </h4>

            <p className="mt-2 text-sm text-slate-600">
              Register students, create login accounts and manage academic records.
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-blue-700">
              Manage students →
            </span>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Lecturer Administration
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/lecturers"
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h4 className="font-semibold text-slate-900">
              Lecturer Management
            </h4>

            <p className="mt-2 text-sm text-slate-600">
              Register lecturers, create login accounts and manage lecturer profiles.
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-blue-700">
              Manage lecturers →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
