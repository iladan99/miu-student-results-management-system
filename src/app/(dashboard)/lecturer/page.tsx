
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getLecturerDashboardData } from "@/services/lecturer-course";

export default async function LecturerDashboard() {
  const user = await requireRole(["LECTURER"]);
  const data = await getLecturerDashboardData(user.id);

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Lecturer Dashboard
        </h2>

        <p className="mt-2 text-slate-600">
          Welcome, {user.fullName}.
        </p>

        <div className="mt-3 text-sm text-slate-500">
          <p>Department: {data.lecturer.department}</p>
          <p>Staff Number: {data.lecturer.staffNumber}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Assigned Courses
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.totalCourses}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Registered Students Across Courses
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.totalStudents}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          My Assigned Courses
        </h3>

        {data.assignments.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-center">
            <h4 className="font-semibold text-slate-800">
              No Courses Assigned
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              You currently have no assigned courses.
              Please contact the administrator if you believe this is an error.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Level</th>
                  <th className="px-5 py-3 font-medium">Credit Units</th>
                  <th className="px-5 py-3 font-medium">Session</th>
                  <th className="px-5 py-3 font-medium">Semester</th>
                  <th className="px-5 py-3 font-medium">Students</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {data.assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {assignment.course.code}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {assignment.course.title}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.course.department.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.course.academicLevel.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.course.creditUnits}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.academicSession.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {assignment.semester.name}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-900">
                      {assignment._count.registrations}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/lecturer/courses/${assignment.id}/students`}
                        className="whitespace-nowrap font-medium text-blue-700 hover:underline"
                      >
                        View Students
                      </Link>
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
