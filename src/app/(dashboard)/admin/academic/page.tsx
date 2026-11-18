
import Link from "next/link";

const sections = [
  {
    title: "Academic Sessions",
    description: "Create, edit and activate academic sessions.",
    href: "/admin/academic/sessions",
  },
  {
    title: "Semesters",
    description: "Manage first and second semesters for each session.",
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
  {
    title: "Grade Scale",
    description:
      "Configure letter grades, score ranges and grade points.",
    href: "/admin/academic/grade-scales",
  },
  {
    title: "Student Management",
    description:
      "Register students and manage their academic records.",
    href: "/admin/students",
  },
];

export default function AcademicAdministrationPage() {
  return (
    <section className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="text-sm text-blue-700 hover:underline"
        >
          ← Administrator Dashboard
        </Link>

        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Academic Administration
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Manage the university&apos;s academic structure and organisation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">
              {section.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {section.description}
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-blue-700">
              Open section →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
