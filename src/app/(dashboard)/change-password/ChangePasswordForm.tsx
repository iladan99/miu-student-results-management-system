
"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  type ChangePasswordState,
} from "./actions";

const initialState: ChangePasswordState = {
  success: false,
  message: "",
};

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Enter your current password"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Enter your new password again"
        />
      </div>

      {state.message && (
        <p
          className={`rounded-md p-3 text-sm ${
            state.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Changing Password..." : "Change Password"}
      </button>
    </form>
  );
}
