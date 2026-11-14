
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

type RoleName = "ADMIN" | "ADMINISTRATOR" | "LECTURER" | "STUDENT";

export async function requireRole(allowedRoles: RoleName[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userRole = user.role.name.toUpperCase() as RoleName;

  if (!allowedRoles.includes(userRole)) {
    switch (userRole) {
      case "ADMIN":
      case "ADMINISTRATOR":
        redirect("/admin");

      case "LECTURER":
        redirect("/lecturer");

      case "STUDENT":
        redirect("/student");

      default:
        redirect("/login");
    }
  }

  return user;
}
