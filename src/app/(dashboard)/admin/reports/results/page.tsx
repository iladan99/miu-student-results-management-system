
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import {
  getAcademicResultsReport,
  getReportFilterOptions,
} from "@/services/admin-reports";

type Props = {
  searchParams: Promise<{
    session?: string;
    semester?: string;
    department?: string;
    course?: string;
  }>;
};

export default async function AcademicResultsReportPage({
  searchParams,
}: Props) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const params = await searchParams;
  const filters = await getReportFilterOptions();

  const report = await getAcademicResultsReport({
    academicSessionId: params.session,
    semesterId: params.semester,
    departmentId: params.department,
    courseId: params.course,
  });

  return (
    <section className="space-y-6">
      <Link
        href="/admin"
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Academic Results Reports
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Review approved student results and course performance.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <form method="GET" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Academic Session
            </label>
            <select
              name="session"
              defaultValue={params.session ?? ""}
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
            >
              <option value="">All Sessions</option>
              {filters.academicSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Semester
            </label>
            <select
              name="semester"
              defaultValue={params.semester ?? ""}
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
            >
              <option value="">All Semesters</option>
              {filters.semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Department
            </label>
            <select
              name="department"
              defaultValue={params.department ?? ""}
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
            >
              <option value="">All Departments</option>
              {filters.departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Course
            </label>
            <select
              name="course"
              defaultValue={params.course ?? ""}
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
            >
              <option value="">All Courses</option>
              {filters.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Apply Filters
            </button>
            <Link
              href="/admin/reports/results"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Approved Results</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {report.total}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Passes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {report.passCount}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Failures</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {report.failCount}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Registration Number</th>
              <th className="p-3">Student</th>
              <th className="p-3">Department</th>
              <th className="p-3">Course</th>
              <th className="p-3">Session</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Total</th>
              <th className="p-3">Grade</th>
            </tr>
          </thead>
          <tbody>
            {report.results.map((result) => {
              const registration = result.registration;

              return (
                <tr key={result.id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">
                    {registration.student.registrationNo}
                  </td>
                  <td className="p-3">
                    {registration.student.user.fullName}
                  </td>
                  <td className="p-3">
                    {registration.student.department.name}
                  </td>
                  <td className="p-3">
                    {registration.course.code}
                  </td>
                  <td className="p-3">
                    {registration.academicSession.name}
                  </td>
                  <td className="p-3">
                    {registration.semester.name}
                  </td>
                  <td className="p-3">
                    {Number(result.totalScore).toFixed(2)}
                  </td>
                  <td className="p-3 font-semibold">
                    {result.letterGrade ?? "-"}
                  </td>
                </tr>
              );
            })}

            {report.results.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No approved results found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
