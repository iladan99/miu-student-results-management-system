
"use client";

import { useActionState } from "react";
import {
  submitCourseResultsAction,
  type SubmitResultsActionState,
} from "./actions";

type Props = {
  assignmentId: string;
  canSubmit: boolean;
};

const initialState: SubmitResultsActionState = {
  success: false,
  message: "",
};

export default function SubmitCourseResultsForm({
  assignmentId,
  canSubmit,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitCourseResultsAction,
    initialState
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-semibold text-slate-900">
            Submit Course Results
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Submit completed results for administrative review.
            Draft and rejected results will be submitted together.
            Already submitted or approved results will not be changed.
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
            disabled={!canSubmit || isPending}
            className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPending ? "Submitting..." : "Submit Results"}
          </button>
        </form>
      </div>

      {!canSubmit && (
        <p className="mt-3 text-sm text-amber-700">
          Submission is unavailable. Ensure every registered
          student has a saved result and that there are draft or
          rejected results awaiting submission.
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
