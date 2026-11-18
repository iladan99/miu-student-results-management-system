
"use server";

import { prisma } from "@/lib/database/prisma";
import {
  hashPassword,
  verifyPassword,
} from "@/lib/password";
import { getCurrentUser, createSession } from "@/lib/auth/session";

export type ChangePasswordState = {
  success: boolean;
  message: string;
};

export async function changePasswordAction(
  _previousState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Your session has expired. Please log in again.",
    };
  }

  const currentPassword = String(
    formData.get("currentPassword") ?? ""
  );

  const newPassword = String(
    formData.get("newPassword") ?? ""
  );

  const confirmPassword = String(
    formData.get("confirmPassword") ?? ""
  );

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "Please complete all password fields.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Your new password must contain at least 8 characters.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "The new passwords do not match.",
    };
  }

  const currentPasswordIsValid = await verifyPassword(
    currentPassword,
    user.passwordHash
  );

  if (!currentPasswordIsValid) {
    return {
      success: false,
      message: "Your current password is incorrect.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "Your new password must be different from your current password.",
    };
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Invalidate all existing sessions before creating a fresh one.
    await tx.authSession.deleteMany({
      where: { userId: user.id },
    });
  });

  // Keep the current user logged in with a new session.
  await createSession(user.id);

  return {
    success: true,
    message: "Your password has been changed successfully.",
  };
}
