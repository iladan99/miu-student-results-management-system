
import Link from "next/link";
import { getAcademicSessions } from "@/services/academic-session";
import SessionForm from "./SessionForm";
import EditSessionForm from "./EditSessionForm";
import { activateSessionAction } from "./actions";

export default async function AcademicSessionsPage() {
  const sessions = await getAcademicSessions();

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
          Academic Sessions
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Create, edit and manage the university&apos;s academic sessions.
        </p>
      </div>

      <SessionForm />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">
            Existing Academic Sessions
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage sessions and select the current academic session.
          </p>
        </div>

        {sessions.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No academic sessions have been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Session</th>
                  <th className="px-6 py-3 font-medium">Start Date</th>
                  <th className="px-6 py-3 font-medium">End Date</th>
                  <th className="px-6 py-3 font-medium">Students</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {session.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(session.startDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(session.endDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {session._count.academicRecords}
                    </td>

                    <td className="px-6 py-4">
                      {session.isCurrent ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Current
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="space-y-3 px-6 py-4">
                      <EditSessionForm
                        id={session.id}
                        name={session.name}
                        startDate={session.startDate.toISOString().slice(0, 10)}
                        endDate={session.endDate.toISOString().slice(0, 10)}
                      />

                      {!session.isCurrent && (
                        <form action={activateSessionAction}>
                          <input
                            type="hidden"
                            name="id"
                            value={session.id}
                          />
                          <button
                            type="submit"
                            className="text-xs font-medium text-green-700 hover:text-green-900"
                          >
                            Set as Current
                          </button>
                        </form>
                      )}
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
