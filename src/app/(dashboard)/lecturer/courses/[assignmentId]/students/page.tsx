import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { getLecturerCourseStudents } from "@/services/lecturer-course-students";
import CAScoreForm from "./CAScoreForm";
import ExamScoreForm from "./ExamScoreForm";
import SubmitCourseResultsButton from "./SubmitCourseResultsButton";

type PageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function LecturerCourseStudentsPage({
  params,
}: PageProps) {
  const user = await requireRole(["LECTURER"]);
  const { assignmentId } = await params;

  const assignment = await getLecturerCourseStudents(
    user.id,
    assignmentId
  );

  if (!assignment) {
    notFound();
  }

  const students = assignment.registrations;

  const missingResults = students.filter(
    (registration) => !registration.result
  ).length;

  const canSubmit =
    students.length > 0 &&
    students.every(
      (registration) =>
        registration.result &&
        (registration.result.status === "DRAFT" ||
          registration.result.status === "REJECTED")
    );

  let disabledReason: string | undefined;

  if (students.length === 0) {
    disabledReason = "There are no registered students for this course.";
  } else if (missingResults > 0) {
    disabledReason = `${missingResults} student(s) still need scores entered before submission.`;
  } else if (!canSubmit) {
    disabledReason =
      "These results have already been submitted or approved.";
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/lecturer"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Lecturer Dashboard
        </Link>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Student Assessment and Results
        </h2>

        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">
            {assignment.course.code} - {assignment.course.title}
          </h3>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              Academic Session: {assignment.academicSession.name}
            </p>
            <p>Semester: {assignment.semester.name}</p>
            <p>Credit Units: {assignment.course.creditUnits}</p>
            <p>Registered Students: {students.length}</p>
            <p>CA Maximum: 40</p>
            <p>Examination Maximum: 60</p>
            <p>Total Maximum: 100</p>
          </div>
        </div>
      </div>

      <SubmitCourseResultsButton
        assignmentId={assignment.id}
        disabled={!canSubmit}
        disabledReason={disabledReason}
      />

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Student Assessment
        </h3>

        {students.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-center">
            <h4 className="font-semibold text-slate-800">
              No Registered Students
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              No students are currently registered for this course
              in the selected academic session and semester.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-medium">S/N</th>
                  <th className="px-5 py-3 font-medium">
                    Registration Number
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Student Name
                  </th>
                  <th className="px-5 py-3 font-medium">CA (40)</th>
                  <th className="px-5 py-3 font-medium">Exam (60)</th>
                  <th className="px-5 py-3 font-medium">Total (100)</th>
                  <th className="px-5 py-3 font-medium">Grade</th>
                  <th className="px-5 py-3 font-medium">
                    Grade Point
                  </th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((registration, index) => {
                  const result = registration.result;

                  const isEditable =
                    !result ||
                    result.status === "DRAFT" ||
                    result.status === "REJECTED";

                  return (
                    <tr key={registration.id}>
                      <td className="px-5 py-4 text-slate-600">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        {registration.student.registrationNo}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {registration.student.user.fullName}
                        <p className="mt-1 text-xs text-slate-500">
                          {registration.student.department.name}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <CAScoreForm
                          assignmentId={assignment.id}
                          registrationId={registration.id}
                          currentScore={
                            result ? result.caScore.toString() : null
                          }
                          isEditable={isEditable}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <ExamScoreForm
                          assignmentId={assignment.id}
                          registrationId={registration.id}
                          currentScore={
                            result ? result.examScore.toString() : null
                          }
                          isEditable={isEditable}
                        />
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {result ? result.totalScore.toString() : "—"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {result?.letterGrade ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {result?.gradePoint != null
                          ? Number(result.gradePoint).toFixed(2)
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-600">
                          {result ? result.status : "NOT ENTERED"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}