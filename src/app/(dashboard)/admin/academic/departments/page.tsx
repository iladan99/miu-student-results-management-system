
import Link from "next/link";
import {
  getDepartments,
  getFacultiesForDepartments,
} from "@/services/department";
import DepartmentForm from "./DepartmentForm";
import EditDepartmentForm from "./EditDepartmentForm";

export default async function DepartmentsPage() {
  const [departments, faculties] = await Promise.all([
    getDepartments(),
    getFacultiesForDepartments(),
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
          Department Management
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Register departments and associate them with university faculties.
        </p>
      </div>

      <DepartmentForm faculties={faculties} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Registered Departments
          </h3>
        </div>

        {departments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No departments have been registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Faculty</th>
                  <th className="px-6 py-3 font-medium">Students</th>
                  <th className="px-6 py-3 font-medium">Lecturers</th>
                  <th className="px-6 py-3 font-medium">Courses</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {departments.map((department) => (
                  <tr key={department.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {department.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {department.code}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {department.faculty.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {department._count.students}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {department._count.lecturers}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {department._count.courses}
                    </td>

                    <td className="px-6 py-4">
                      <EditDepartmentForm
                        id={department.id}
                        name={department.name}
                        code={department.code}
                        facultyId={department.facultyId}
                        faculties={faculties}
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
