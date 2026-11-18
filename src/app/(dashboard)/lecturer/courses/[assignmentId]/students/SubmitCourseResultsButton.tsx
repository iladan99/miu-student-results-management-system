"use client";

import { useActionState } from "react";
import { submitCourseResultsAction } from "./actions";

type Props = {
  assignmentId: string;
  disabled: boolean;
  disabledReason?: string;
};

const initialState = {
  success: false,
  message: "",
};

export default function SubmitCourseResultsButton({
  assignmentId,
  disabled,
  disabledReason,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitCourseResultsAction,
    initialState
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Submit Course Results
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Submit the completed results for all registered
            students to the administrator for review.
          </p>
        </div>

        <form action={formAction}>
          <input
            type="hidden"
            name="assignmentId"
            value={assignmentId}
          />

          <button
            type="submit"
            disabled={disabled || isPending}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPending ? "Submitting..." : "Submit Course Results"}
          </button>
        </form>
      </div>

      {disabled && disabledReason && (
        <p className="mt-3 text-sm text-amber-700">
          {disabledReason}
        </p>
      )}

      {state.message && (
        <p
          className={`mt-3 text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}