
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import {
  getReportFilterOptions,
  getStudentReport,
} from "@/services/admin-reports";

type Props = {
  searchParams: Promise<{
    department?: string;
    level?: string;
  }>;
};

export default async function StudentReportsPage({ searchParams }: Props) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const params = await searchParams;
  const filters = await getReportFilterOptions();

  const { students, total } = await getStudentReport({
    departmentId: params.department,
    academicLevelId: params.level,
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
          Student Reports
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          View registered students and their current academic levels.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <form method="GET" className="grid gap-4 sm:grid-cols-3">
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
              Academic Level
            </label>
            <select
              name="level"
              defaultValue={params.level ?? ""}
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
            >
              <option value="">All Levels</option>
              {filters.academicLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Filter
            </button>
            <Link
              href="/admin/reports/students"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Total Students</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{total}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Registration Number</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Academic Level</th>
              <th className="p-3">Admission Year</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{student.registrationNo}</td>
                <td className="p-3">{student.user.fullName}</td>
                <td className="p-3">{student.department.name}</td>
                <td className="p-3">
                  {student.academicRecords[0]?.academicLevel.name ?? "Not assigned"}
                </td>
                <td className="p-3">{student.admissionYear}</td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No students found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
