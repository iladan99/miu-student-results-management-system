
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  const user = await requireRole([
    "ADMIN",
    "ADMINISTRATOR",
    "LECTURER",
    "STUDENT",
  ]);

  const role = user.role.name.toUpperCase();

  const dashboardPath =
    role === "STUDENT"
      ? "/student"
      : role === "LECTURER"
        ? "/lecturer"
        : "/admin";

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <Link
        href={dashboardPath}
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Change Password
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Update your account password whenever you wish. Changing it is
          optional.
        </p>
      </div>

      <ChangePasswordForm />

      <p className="text-xs text-slate-500">
        Other active login sessions will be signed out after a successful
        password change.
      </p>
    </section>
  );
}
