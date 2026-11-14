
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { loginUser } from "@/lib/auth/auth";

export type LoginState = {
  error?: string;
};

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
});

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  try {
    const result = await loginUser(
      validatedFields.data.identifier,
      validatedFields.data.password
    );

    if (!result.success) {
      return { error: result.message };
    }

    switch (result.role?.toUpperCase()) {
      case "ADMIN":
      case "ADMINISTRATOR":
        redirect("/admin");

      case "LECTURER":
        redirect("/lecturer");

      case "STUDENT":
        redirect("/student");

      default:
        return { error: "Your account has an unrecognised role." };
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      error: "Unable to sign in right now. Please try again.",
    };
  }
}
