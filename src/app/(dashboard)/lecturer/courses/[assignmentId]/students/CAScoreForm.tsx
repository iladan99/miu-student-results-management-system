
"use client";

import { useActionState } from "react";
import {
  saveCAScoreAction,
  type CAActionState,
} from "./actions";

type CAScoreFormProps = {
  assignmentId: string;
  registrationId: string;
  currentScore: string | null;
  isEditable: boolean;
};

const initialState: CAActionState = {
  success: false,
  message: "",
};

export default function CAScoreForm({
  assignmentId,
  registrationId,
  currentScore,
  isEditable,
}: CAScoreFormProps) {
  const [state, formAction, pending] = useActionState(
    saveCAScoreAction,
    initialState
  );

  if (!isEditable) {
    return (
      <span className="text-sm text-slate-500">
        Locked
      </span>
    );
  }

  return (
    <form action={formAction} className="min-w-44 space-y-2">
      <input
        type="hidden"
        name="assignmentId"
        value={assignmentId}
      />

      <input
        type="hidden"
        name="registrationId"
        value={registrationId}
      />

      <div className="flex items-center gap-2">
        <input
          type="number"
          name="caScore"
          min="0"
          max="40"
          step="0.01"
          defaultValue={currentScore ?? ""}
          required
          aria-label="CA score out of 40"
          placeholder="0 - 40"
          className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </div>

      {state.message && (
        <p
          aria-live="polite"
          className={`text-xs ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
