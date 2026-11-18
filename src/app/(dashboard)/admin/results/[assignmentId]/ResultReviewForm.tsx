
"use client";

import { useActionState } from "react";
import {
  reviewCourseResultsAction,
  type ReviewActionState,
} from "./actions";

type Props = {
  assignmentId: string;
};

const initialState: ReviewActionState = {
  success: false,
  message: "",
};

export default function ResultReviewForm({
  assignmentId,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    reviewCourseResultsAction,
    initialState
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">
        Administrator Decision
      </h3>

      <p className="mt-1 text-sm text-slate-600">
        Approve these results or reject them and provide a reason
        for the lecturer.
      </p>

      <form action={formAction} className="mt-4 space-y-4">
        <input
          type="hidden"
          name="assignmentId"
          value={assignmentId}
        />

        <div>
          <label
            htmlFor="comments"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Comments or rejection reason
          </label>

          <textarea
            id="comments"
            name="comments"
            rows={3}
            maxLength={500}
            placeholder="Enter a reason if rejecting the results..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="decision"
            value="APPROVED"
            disabled={isPending}
            className="rounded-md bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Approve Results"}
          </button>

          <button
            type="submit"
            name="decision"
            value="REJECTED"
            disabled={isPending}
            className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Reject Results"}
          </button>
        </div>
      </form>

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
