
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getStudentCourseRegistrationData } from "@/services/course-registration";
import { registerForCourseAction } from "./actions";

type PageProps = {
  searchParams: Promise<{
    semester?: string;
    status?: string;
    message?: string;
  }>;
};

export default async function CourseRegistrationPage({
  searchParams,
}: PageProps) {
  const user = await requireRole(["STUDENT"]);
  const params = await searchParams;

  const data = await getStudentCourseRegistrationData(
    user.id,
    params.semester,
  );

  if (!data) {
    return (
      <section className="rounded-lg border border-red-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Student record not found
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your account is not currently linked to a student record. Please
          contact the administrator.
        </p>
      </section>
    );
  }

  const totalCreditUnits = data.registrations
    .filter((registration) => registration.status === "REGISTERED")
    .reduce(
      (total, registration) => total + registration.course.creditUnits,
      0,
    );

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/student"
          className="text-sm text-blue-700 hover:underline"
        >
          ← Student Dashboard
        </Link>

        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Course Registration
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          View available courses and register for the current academic session.
        </p>
      </div>

      {params.message && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            params.status === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {params.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Student</p>
          <p className="mt-1 font-semibold text-slate-900">
            {user.fullName}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {data.student.registrationNo}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Department and Level</p>
          <p className="mt-1 font-semibold text-slate-900">
            {data.student.department.name}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {data.academicRecord
              ? data.academicRecord.academicLevel.name
              : "Academic level not assigned"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Academic Session</p>
          <p className="mt-1 font-semibold text-slate-900">
            {data.academicSession?.name ?? "Not assigned"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {data.selectedSemester?.name ?? "No semester selected"}
          </p>
        </div>
      </div>

      {!data.academicRecord || !data.academicSession ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            Academic record unavailable
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            Your academic level has not been assigned to the current academic
            session. Contact the administrator before registering for courses.
          </p>
        </div>
      ) : data.semesters.length === 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            No semesters available
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            No semesters have been created for the current academic session.
            Contact the administrator.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <form
              method="GET"
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="semester"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Select Semester
                </label>

                <select
                  id="semester"
                  name="semester"
                  defaultValue={data.selectedSemester?.id}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {data.semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="rounded-md bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                View Semester
              </button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Registered Courses
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {
                  data.registrations.filter(
                    (registration) => registration.status === "REGISTERED",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Total Registered Credit Units
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalCreditUnits}
              </p>
            </div>
          </div>

          {/* Available Courses */}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="font-semibold text-slate-900">
                Available Courses
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Courses assigned to lecturers for your department and academic
                level.
              </p>
            </div>

            {data.availableCourses.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-500">
                No courses are currently available for your department and
                academic level in this semester.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Course</th>
                      <th className="px-5 py-3 font-medium">Credit Units</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Lecturer</th>
                      <th className="px-5 py-3 font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.availableCourses.map(({ course, assignments }) => {
                      const existingRegistration = data.registrations.find(
                        (registration) => registration.courseId === course.id,
                      );

                      const alreadyRegistered =
                        existingRegistration?.status === "REGISTERED" ||
                        existingRegistration?.status === "COMPLETED";

                      return (
                        <tr key={course.id}>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {course.code}
                            </p>
                            <p className="text-xs text-slate-500">
                              {course.title}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-slate-700">
                            {course.creditUnits}
                          </td>

                          <td className="px-5 py-4 text-slate-700">
                            {course.courseType === "COMPULSORY"
                              ? "Compulsory"
                              : "Elective"}
                          </td>

                          <td className="px-5 py-4 text-slate-700">
                            {existingRegistration?.courseAssignment?.lecturer
                              .user.fullName ??
                              (assignments.length === 1
                                ? assignments[0].lecturer.user.fullName
                                : `${assignments.length} lecturers available`)}
                          </td>

                          <td className="px-5 py-4">
                            {alreadyRegistered ? (
                              <span className="text-xs font-medium text-green-700">
                                {existingRegistration?.status === "COMPLETED"
                                  ? "Completed"
                                  : "Registered"}
                              </span>
                            ) : (
                              <form action={registerForCourseAction}>
                                {assignments.length === 1 ? (
                                  <input
                                    type="hidden"
                                    name="assignmentId"
                                    value={assignments[0].id}
                                  />
                                ) : (
                                  <select
                                    name="assignmentId"
                                    defaultValue={assignments[0].id}
                                    className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                                  >
                                    {assignments.map((assignment) => (
                                      <option
                                        key={assignment.id}
                                        value={assignment.id}
                                      >
                                        {assignment.lecturer.user.fullName}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                <button
                                  type="submit"
                                  className="rounded-md bg-blue-700 px-3 py-2 text-xs font-medium text-white hover:bg-blue-800"
                                >
                                  {existingRegistration?.status === "DROPPED"
                                    ? "Register Again"
                                    : "Register"}
                                </button>
                              </form>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* My Registered Courses */}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="font-semibold text-slate-900">
                My Registered Courses
              </h3>
            </div>

            {data.registrations.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-500">
                You have not registered for any courses in this semester.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">Course</th>
                      <th className="px-5 py-3 font-medium">Credit Units</th>
                      <th className="px-5 py-3 font-medium">Lecturer</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.registrations.map((registration) => (
                      <tr key={registration.id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {registration.course.code}
                          </p>
                          <p className="text-xs text-slate-500">
                            {registration.course.title}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {registration.course.creditUnits}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {registration.courseAssignment?.lecturer.user
                            .fullName ?? "Not assigned"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              registration.status === "REGISTERED"
                                ? "bg-green-100 text-green-700"
                                : registration.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
