
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import {
  getStudentFormOptions,
  getStudents,
} from "@/services/student";
import StudentForm from "./StudentForm";
import EditStudentForm from "./EditStudentForm";
import { setStudentStatusAction } from "./actions";
import BulkStudentImport from "./BulkStudentImport";

export default async function StudentsPage() {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const [students, options] = await Promise.all([
    getStudents(),
    getStudentFormOptions(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-blue-700 hover:underline"
        >
          ← Administrator Dashboard
        </Link>

        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Student Management
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Register students, manage their records and control account access.
        </p>
      </div>

      <StudentForm
        departments={options.departments}
        academicSessions={options.academicSessions}
        academicLevels={options.academicLevels}
      />
      <BulkStudentImport />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Registered Students ({students.length})
          </h3>
        </div>

        {students.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No students have been registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Registration No.</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Level</th>
                  <th className="px-6 py-3 font-medium">Session</th>
                  <th className="px-6 py-3 font-medium">Admission Year</th>
                  <th className="px-6 py-3 font-medium">Account</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const academicRecord = student.academicRecords[0];

                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {student.user.fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.user.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {student.registrationNo}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {student.department.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {academicRecord?.academicLevel.name ?? "Not assigned"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {academicRecord?.academicSession.name ?? "Not assigned"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {student.admissionYear}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            student.user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="space-y-3 px-6 py-4">
                        <EditStudentForm
                          student={{
                            id: student.id,
                            registrationNo: student.registrationNo,
                            departmentId: student.departmentId,
                            admissionYear: student.admissionYear,
                            user: {
                              fullName: student.user.fullName,
                              email: student.user.email,
                            },
                          }}
                          departments={options.departments}
                        />

                        <form action={setStudentStatusAction}>
                          <input
                            type="hidden"
                            name="studentId"
                            value={student.id}
                          />
                          <input
                            type="hidden"
                            name="isActive"
                            value={String(!student.user.isActive)}
                          />

                          <button
                            type="submit"
                            className={`text-sm font-medium hover:underline ${
                              student.user.isActive
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            {student.user.isActive
                              ? "Deactivate account"
                              : "Reactivate account"}
                          </button>
                        </form>
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
