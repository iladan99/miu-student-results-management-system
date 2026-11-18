
"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { getCurrentUser, deleteSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function changePasswordAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    redirect("/change-password?error=invalid");
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect("/change-password?error=empty");
  }

  const passwordIsValid = await verifyPassword(
    currentPassword,
    user.passwordHash
  );

  if (!passwordIsValid) {
    redirect("/change-password?error=incorrect");
  }

  if (newPassword.length < 8) {
    redirect("/change-password?error=short");
  }

  if (newPassword !== confirmPassword) {
    redirect("/change-password?error=mismatch");
  }

  if (currentPassword === newPassword) {
    redirect("/change-password?error=same");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.authSession.deleteMany({
      where: { userId: user.id },
    }),
  ]);

  await deleteSession();

  redirect("/login?passwordChanged=1");
}
