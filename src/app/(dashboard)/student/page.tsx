
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";

export default async function StudentDashboard() {
  const user = await requireRole(["STUDENT"]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Student Dashboard
        </h2>

        <p className="mt-2 text-slate-600">
          Welcome, {user.fullName}.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Access your course registration and academic information from this
          dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/student/course-registration"
          className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">
            Course Registration
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            View available courses, register for courses and check your
            registered credit units.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-blue-700">
            Open Course Registration →
          </span>
        </Link>

        <Link
          href="/student/results"
          className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">
            Academic Results
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            View your approved examination scores, grades and academic results.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-blue-700">
            View Results →
          </span>
        </Link>

        <Link
          href="/student/results"
          className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">
            GPA and CGPA
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Check your semester GPA, cumulative GPA and total credit units.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-blue-700">
            View GPA and CGPA →
          </span>
        </Link>
      </div>
    </section>
  );
}
