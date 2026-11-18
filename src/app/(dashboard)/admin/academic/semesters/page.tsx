
import Link from "next/link";
import {
  getSemesters,
  getAcademicSessionsForSemester,
} from "@/services/semester";
import SemesterForm from "./SemesterForm";
import EditSemesterForm from "./EditSemesterForm";

export default async function SemestersPage() {
  const [semesters, sessions] = await Promise.all([
    getSemesters(),
    getAcademicSessionsForSemester(),
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
          Semester Management
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Create and manage semesters under their respective academic sessions.
        </p>
      </div>

      <SemesterForm sessions={sessions} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Existing Semesters
          </h3>
        </div>

        {semesters.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No semesters have been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Semester</th>
                  <th className="px-6 py-3 font-medium">Academic Session</th>
                  <th className="px-6 py-3 font-medium">Course Assignments</th>
                  <th className="px-6 py-3 font-medium">Registrations</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {semesters.map((semester) => (
                  <tr key={semester.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {semester.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {semester.academicSession.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {semester._count.courseAssignments}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {semester._count.registrations}
                    </td>

                    <td className="px-6 py-4">
                      <EditSemesterForm
                        id={semester.id}
                        name={semester.name}
                        academicSessionId={semester.academicSessionId}
                        sessions={sessions}
                      />
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
