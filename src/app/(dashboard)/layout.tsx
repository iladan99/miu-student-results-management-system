
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "./actions";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              MIU Student Results Management System
            </h1>
          </div>

          <div className="flex items-center gap-5">
  <div className="text-right">
    <p className="text-sm font-medium text-slate-800">
      {user.fullName}
    </p>
    <p className="text-xs text-slate-500">
      {user.role.name}
    </p>
  </div>

  <Link
    href="/change-password"
    className="text-sm font-medium text-blue-700 hover:underline"
  >
    Change Password
  </Link>

  <form action={logoutAction}>
    <button
      type="submit"
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Logout
    </button>
  </form>
</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
