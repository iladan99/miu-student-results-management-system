
import { prisma } from "@/lib/database/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth/session";

const ALLOWED_ROLES = [
  "ADMIN",
  "ADMINISTRATOR",
  "LECTURER",
  "STUDENT",
];

export async function loginUser(
  identifier: string,
  password: string
) {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    },
    include: {
      role: true,
    },
  });

  if (!user || !user.isActive) {
    return {
      success: false,
      message: "Invalid login credentials.",
    };
  }

  const passwordIsValid = await verifyPassword(
    password,
    user.passwordHash
  );

  if (!passwordIsValid) {
    return {
      success: false,
      message: "Invalid login credentials.",
    };
  }

  const roleName = user.role.name.toUpperCase();

  if (!ALLOWED_ROLES.includes(roleName)) {
    return {
      success: false,
      message: "Your account is not configured for system access.",
    };
  }

  await createSession(user.id);

  return {
    success: true,
    message: "Login successful.",
    role: roleName,
  };
}
