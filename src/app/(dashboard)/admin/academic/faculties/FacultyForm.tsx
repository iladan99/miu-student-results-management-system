
"use client";

import { useActionState } from "react";
import {
  createFacultyAction,
  type FacultyActionState,
} from "./actions";

const initialState: FacultyActionState = {};

export default function FacultyForm() {
  const [state, formAction, isPending] = useActionState(
    createFacultyAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Register Faculty
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Enter the details of the faculty.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Faculty Name
        </label>
        <input
          name="name"
          type="text"
          placeholder="e.g. Faculty of Computing"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {state.errors?.name?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Faculty Code
        </label>
        <input
          name="code"
          type="text"
          placeholder="e.g. FCOM"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
        />
        {state.errors?.code?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description (Optional)
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Brief description of the faculty."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {state.errors?.description?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      {state.message && (
        <p
          role="status"
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Create Faculty"}
      </button>
    </form>
  );
}
