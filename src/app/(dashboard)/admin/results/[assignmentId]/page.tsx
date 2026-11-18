
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { getCourseResultsForReview } from "@/services/result";
import ResultReviewForm from "./ResultReviewForm";

type PageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function CourseResultsReviewPage({
  params,
}: PageProps) {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const { assignmentId } = await params;

  const assignment = await getCourseResultsForReview(assignmentId);

  if (!assignment) {
    notFound();
  }

  const students = assignment.registrations;

  const allSubmitted =
    students.length > 0 &&
    students.every(
      (registration) =>
        registration.result?.status === "SUBMITTED"
    );

  const submittedCount = students.filter(
    (registration) =>
      registration.result?.status === "SUBMITTED"
  ).length;

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/admin/results"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Result Approval
        </Link>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Review Course Results
        </h2>

        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">
            {assignment.course.code} - {assignment.course.title}
          </h3>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              Lecturer: {assignment.lecturer.user.fullName}
            </p>
            <p>
              Academic Session: {assignment.academicSession.name}
            </p>
            <p>Semester: {assignment.semester.name}</p>
            <p>Registered Students: {students.length}</p>
            <p>Submitted Results: {submittedCount}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 font-medium">S/N</th>
              <th className="px-5 py-3 font-medium">
                Registration Number
              </th>
              <th className="px-5 py-3 font-medium">Student Name</th>
              <th className="px-5 py-3 font-medium">CA (40)</th>
              <th className="px-5 py-3 font-medium">Exam (60)</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Grade</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {students.map((registration, index) => {
              const result = registration.result;

              return (
                <tr key={registration.id}>
                  <td className="px-5 py-4">{index + 1}</td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {registration.student.registrationNo}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {registration.student.user.fullName}
                  </td>

                  <td className="px-5 py-4">
                    {result?.caScore.toString() ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    {result?.examScore.toString() ?? "—"}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {result?.totalScore.toString() ?? "—"}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {result?.letterGrade ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-600">
                      {result?.status ?? "NO RESULT"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {allSubmitted ? (
        <ResultReviewForm assignmentId={assignment.id} />
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          This course cannot be reviewed because not all registered
          student results are currently submitted.
        </div>
      )}
    </section>
  );
}
