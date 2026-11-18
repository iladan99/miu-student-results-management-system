
import Link from "next/link";
import { getFaculties } from "@/services/faculty";
import FacultyForm from "./FacultyForm";
import EditFacultyForm from "./EditFacultyForm";

export default async function FacultiesPage() {
  const faculties = await getFaculties();

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
          Faculty Management
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Register and manage university faculties.
        </p>
      </div>

      <FacultyForm />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Registered Faculties
          </h3>
        </div>

        {faculties.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No faculties have been registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Faculty Name</th>
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Departments</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {faculties.map((faculty) => (
                  <tr key={faculty.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {faculty.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {faculty.code}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {faculty._count.departments}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {faculty.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <EditFacultyForm
                        id={faculty.id}
                        name={faculty.name}
                        code={faculty.code}
                        description={faculty.description}
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
