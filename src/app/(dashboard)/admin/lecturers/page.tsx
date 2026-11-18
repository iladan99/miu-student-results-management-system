
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import {
  getLecturerFormOptions,
  getLecturers,
} from "@/services/lecturer";
import LecturerForm from "./LecturerForm";
import EditLecturerForm from "./EditLecturerForm";
import { setLecturerStatusAction } from "./actions";

export default async function LecturersPage() {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const [lecturers, options] = await Promise.all([
    getLecturers(),
    getLecturerFormOptions(),
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
          Lecturer Management
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Register lecturers, manage their profiles and control account access.
        </p>
      </div>

      <LecturerForm departments={options.departments} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Registered Lecturers ({lecturers.length})
          </h3>
        </div>

        {lecturers.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No lecturers have been registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Lecturer</th>
                  <th className="px-6 py-3 font-medium">Staff Number</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Account</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {lecturers.map((lecturer) => (
                  <tr key={lecturer.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {lecturer.user.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lecturer.user.email}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {lecturer.staffNumber}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {lecturer.department.name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          lecturer.user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {lecturer.user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="space-y-3 px-6 py-4">
                      <EditLecturerForm
                        lecturer={{
                          id: lecturer.id,
                          staffNumber: lecturer.staffNumber,
                          departmentId: lecturer.departmentId,
                          user: {
                            fullName: lecturer.user.fullName,
                            email: lecturer.user.email,
                          },
                        }}
                        departments={options.departments}
                      />

                      <form action={setLecturerStatusAction}>
                        <input
                          type="hidden"
                          name="lecturerId"
                          value={lecturer.id}
                        />
                        <input
                          type="hidden"
                          name="isActive"
                          value={String(!lecturer.user.isActive)}
                        />

                        <button
                          type="submit"
                          className={`text-sm font-medium hover:underline ${
                            lecturer.user.isActive
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          {lecturer.user.isActive
                            ? "Deactivate account"
                            : "Reactivate account"}
                        </button>
                      </form>
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
