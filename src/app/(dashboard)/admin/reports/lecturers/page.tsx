
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import {
  getLecturerReport,
  getReportFilterOptions,
} from "@/services/admin-reports";

type Props = {
  searchParams: Promise<{
    department?: string;
  }>;
};

export default async function LecturerReportsPage({ searchParams }: Props) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const params = await searchParams;
  const filters = await getReportFilterOptions();

  const { lecturers, total } = await getLecturerReport({
    departmentId: params.department,
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
          Lecturer Reports
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          View registered lecturers and their course assignments.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
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

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Filter
          </button>

          <Link
            href="/admin/reports/lecturers"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm"
          >
            Reset
          </Link>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Total Lecturers</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{total}</p>
      </div>

      <div className="space-y-4">
        {lecturers.map((lecturer) => (
          <div
            key={lecturer.id}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {lecturer.user.fullName}
                </h3>
                <p className="text-sm text-slate-500">
                  Staff Number: {lecturer.staffNumber}
                </p>
                <p className="text-sm text-slate-500">
                  Department: {lecturer.department.name}
                </p>
              </div>

              <p className="text-sm text-slate-600">
                {lecturer.courseAssignments.length} course assignment(s)
              </p>
            </div>

            {lecturer.courseAssignments.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-2">Course</th>
                      <th className="p-2">Academic Session</th>
                      <th className="p-2">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturer.courseAssignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        className="border-t border-slate-100"
                      >
                        <td className="p-2">
                          {assignment.course.code} - {assignment.course.title}
                        </td>
                        <td className="p-2">
                          {assignment.academicSession.name}
                        </td>
                        <td className="p-2">{assignment.semester.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No course assignments found.
              </p>
            )}
          </div>
        ))}

        {lecturers.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No lecturers found for the selected department.
          </div>
        )}
      </div>
    </section>
  );
}
