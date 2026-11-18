
import Link from "next/link";
import AcademicLevelForm from "./AcademicLevelForm";
import EditAcademicLevelForm from "./EditAcademicLevelForm";
import { getAcademicLevels } from "@/services/academic-level";

export default async function AcademicLevelsPage() {
  const levels = await getAcademicLevels();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/academic"
        className="text-sm text-blue-700 hover:underline"
      >
        ← Academic Administration
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Academic Levels
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Create and manage the academic levels used by the university.
        </p>
      </div>

      <AcademicLevelForm />

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Registered Academic Levels
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {levels.length} academic level(s) registered
          </p>
        </div>

        {levels.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">
            No academic levels have been added.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">Level Number</th>
                  <th className="px-5 py-3">Courses</th>
                  <th className="px-5 py-3">Student Records</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {levels.map((level) => (
                  <tr key={level.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {level.name}
                    </td>
                    <td className="px-5 py-4">{level.levelNumber}</td>
                    <td className="px-5 py-4">
                      {level._count.courses}
                    </td>
                    <td className="px-5 py-4">
                      {level._count.academicRecords}
                    </td>
                    <td className="px-5 py-4">
                      <EditAcademicLevelForm
                        id={level.id}
                        name={level.name}
                        levelNumber={level.levelNumber}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
