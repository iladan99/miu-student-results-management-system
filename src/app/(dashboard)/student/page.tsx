
import { requireRole } from "@/lib/auth/authorization";

export default async function StudentDashboard() {
  const user = await requireRole(["STUDENT"]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">
        Student Dashboard
      </h2>

      <p className="mt-2 text-slate-600">
        Welcome, {user.fullName}.
      </p>

      <p className="mt-4 text-sm text-slate-500">
        View registered courses, academic results, GPA and CGPA from this
        dashboard.
      </p>
    </section>
  );
}
