
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import {
  getCourseAssignmentFormOptions,
  getCourseAssignments,
} from "@/services/course-assignment";
import CourseAssignmentForm from "./CourseAssignmentForm";
import { deleteCourseAssignmentAction } from "./actions";

type Props = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function CourseAssignmentsPage({
  searchParams,
}: Props) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const [assignments, options, params] = await Promise.all([
    getCourseAssignments(),
    getCourseAssignmentFormOptions(),
    searchParams,
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
          Lecturer Course Assignment
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Assign courses to lecturers for specific academic sessions and semesters.
        </p>
      </div>

      {params.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      )}

      {params.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {params.success}
        </div>
      )}

      <CourseAssignmentForm
        lecturers={options.lecturers}
        courses={options.courses}
        academicSessions={options.academicSessions}
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Existing Course Assignments ({assignments.length})
          </h3>
        </div>

        {assignments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No course assignments have been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Lecturer</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Session</th>
                  <th className="px-5 py-3 font-medium">Semester</th>
                  <th className="px-5 py-3 font-medium">Registrations</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {assignment.lecturer.user.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {assignment.lecturer.staffNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        {assignment.lecturer.department.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {assignment.course.code}
                      </p>
                      <p className="text-xs text-slate-500">
                        {assignment.course.title}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.academicSession.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.semester.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment._count.registrations}
                    </td>

                    <td className="px-5 py-4">
                      {assignment._count.registrations > 0 ? (
                        <span className="text-xs text-slate-500">
                          Cannot remove: students registered
                        </span>
                      ) : (
                        <form action={deleteCourseAssignmentAction}>
                          <input
                            type="hidden"
                            name="assignmentId"
                            value={assignment.id}
                          />

                          <button
                            type="submit"
                            className="text-sm font-medium text-red-700 hover:underline"
                          >
                            Remove assignment
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
