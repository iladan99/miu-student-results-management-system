
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getStudentResults } from "@/services/student-results";

export default async function StudentResultsPage() {
  const user = await requireRole(["STUDENT"]);
  const data = await getStudentResults(user.id);

  if (!data) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Student Record Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your student profile could not be found. Please contact the administrator.
        </p>
        <Link
          href="/student"
          className="mt-4 inline-block text-sm font-medium text-blue-700"
        >
          Back to Dashboard
        </Link>
      </section>
    );
  }

  type Registration = (typeof data.registrations)[number];

  function calculateGPA(registrations: Registration[]) {
    let totalCreditUnits = 0;
    let totalQualityPoints = 0;

    for (const registration of registrations) {
      if (!registration.result) continue;

      const creditUnits = registration.course.creditUnits;
      const gradePoint = Number(registration.result.gradePoint ?? 0);

      totalCreditUnits += creditUnits;
      totalQualityPoints += creditUnits * gradePoint;
    }

    return {
      totalCreditUnits,
      totalQualityPoints,
      gpa:
        totalCreditUnits > 0
          ? totalQualityPoints / totalCreditUnits
          : 0,
    };
  }

  const overall = calculateGPA(data.registrations);

  const semesterGroups = new Map<
    string,
    {
      academicSession: Registration["academicSession"];
      semester: Registration["semester"];
      registrations: Registration[];
    }
  >();

  for (const registration of data.registrations) {
    const key = `${registration.academicSessionId}-${registration.semesterId}`;

    if (!semesterGroups.has(key)) {
      semesterGroups.set(key, {
        academicSession: registration.academicSession,
        semester: registration.semester,
        registrations: [],
      });
    }

    semesterGroups.get(key)!.registrations.push(registration);
  }

  const orderedGroups = Array.from(semesterGroups.values()).sort(
    (a, b) => {
      const sessionDifference =
        new Date(a.academicSession.startDate).getTime() -
        new Date(b.academicSession.startDate).getTime();

      if (sessionDifference !== 0) {
        return sessionDifference;
      }

      return (
        new Date(a.semester.createdAt).getTime() -
        new Date(b.semester.createdAt).getTime()
      );
    }
  );

  return (
    <section className="space-y-8">
      <div className="print:hidden">
        <Link
          href="/student"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Academic Results
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Approved academic results and performance summary.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 print:border-slate-300">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Student Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Full Name</p>
            <p className="font-medium text-slate-900">
              {data.student.user.fullName}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Registration Number</p>
            <p className="font-medium text-slate-900">
              {data.student.registrationNo}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Department</p>
            <p className="font-medium text-slate-900">
              {data.student.department.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Cumulative GPA (CGPA)</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            {overall.gpa.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Out of 5.00
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Credit Units</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {overall.totalCreditUnits}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Approved Courses</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.registrations.length}
          </p>
        </div>
      </div>

      {data.registrations.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <h3 className="font-semibold text-slate-900">
            No Approved Results Available
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Your results will appear here after they have been approved by the administrator.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orderedGroups.map((group) => {
            const semesterSummary = calculateGPA(group.registrations);

            return (
              <div
                key={`${group.academicSession.id}-${group.semester.id}`}
                className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 print:break-inside-avoid"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {group.academicSession.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {group.semester.name}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-slate-500">
                      Semester GPA
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {semesterSummary.gpa.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50">
                        <th className="px-3 py-3 font-semibold text-slate-700">
                          Course
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          Units
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          CA
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          Exam
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          Total
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          Grade
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          Grade Point
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-slate-700">
                          Quality Points
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.registrations.map((registration) => {
                        const result = registration.result;

                        if (!result) return null;

                        const creditUnits = registration.course.creditUnits;
                        const gradePoint = Number(result.gradePoint ?? 0);
                        const qualityPoints = creditUnits * gradePoint;

                        return (
                          <tr
                            key={registration.id}
                            className="border-b border-slate-100"
                          >
                            <td className="px-3 py-3">
                              <p className="font-medium text-slate-900">
                                {registration.course.code}
                              </p>
                              <p className="text-xs text-slate-500">
                                {registration.course.title}
                              </p>
                            </td>

                            <td className="px-3 py-3 text-center">
                              {creditUnits}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {Number(result.caScore).toFixed(2)}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {Number(result.examScore).toFixed(2)}
                            </td>

                            <td className="px-3 py-3 text-center font-medium">
                              {Number(result.totalScore).toFixed(2)}
                            </td>

                            <td className="px-3 py-3 text-center font-semibold">
                              {result.letterGrade ?? "-"}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {gradePoint.toFixed(2)}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {qualityPoints.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4 text-sm">
                  <p className="text-slate-600">
                    Total Credit Units:{" "}
                    <strong className="text-slate-900">
                      {semesterSummary.totalCreditUnits}
                    </strong>
                  </p>

                  <p className="text-slate-600">
                    Total Quality Points:{" "}
                    <strong className="text-slate-900">
                      {semesterSummary.totalQualityPoints.toFixed(2)}
                    </strong>
                  </p>

                  <p className="text-slate-600">
                    Semester GPA:{" "}
                    <strong className="text-slate-900">
                      {semesterSummary.gpa.toFixed(2)}
                    </strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-500 print:hidden">
        To print this page, press Ctrl + P.
      </p>
    </section>
  );
}
