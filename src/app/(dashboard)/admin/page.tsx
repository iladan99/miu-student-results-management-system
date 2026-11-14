
import { requireRole } from "@/lib/auth/authorization";

export default async function AdminDashboard() {
  const user = await requireRole(["ADMIN", "ADMINISTRATOR"]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">
        Administrator Dashboard
      </h2>

      <p className="mt-2 text-slate-600">
        Welcome, {user.fullName}.
      </p>

      <p className="mt-4 text-sm text-slate-500">
        Manage students, lecturers, academic sessions, courses and results
        from this dashboard.
      </p>
    </section>
  );
}
