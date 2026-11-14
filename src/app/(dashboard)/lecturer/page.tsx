
import { requireRole } from "@/lib/auth/authorization";

export default async function LecturerDashboard() {
  const user = await requireRole(["LECTURER"]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">
        Lecturer Dashboard
      </h2>

      <p className="mt-2 text-slate-600">
        Welcome, {user.fullName}.
      </p>

      <p className="mt-4 text-sm text-slate-500">
        View assigned courses, manage student assessments and submit results
        from this dashboard.
      </p>
    </section>
  );
}
