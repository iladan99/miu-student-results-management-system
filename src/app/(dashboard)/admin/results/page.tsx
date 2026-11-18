
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getSubmittedCourseAssignments } from "@/services/result";

export default async function AdminResultsPage() {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const assignments = await getSubmittedCourseAssignments();

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Administrator Dashboard
        </Link>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Result Approval
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Review course results submitted by lecturers.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <h3 className="font-semibold text-slate-800">
            No Pending Results
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Submitted course results will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Lecturer</th>
                <th className="px-5 py-3 font-medium">Session</th>
                <th className="px-5 py-3 font-medium">Semester</th>
                <th className="px-5 py-3 font-medium">Students</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {assignments.map((assignment) => {
                const submittedCount =
                  assignment.registrations.filter(
                    (registration) =>
                      registration.result?.status === "SUBMITTED"
                  ).length;

                return (
                  <tr key={assignment.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {assignment.course.code}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {assignment.course.title}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {assignment.lecturer.user.fullName}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {assignment.academicSession.name}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {assignment.semester.name}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {submittedCount}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/results/${assignment.id}`}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        Review Results →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
