
"use client";

import { useActionState } from "react";
import {
  createSemesterAction,
  type SemesterActionState,
} from "./actions";

type AcademicSessionOption = {
  id: string;
  name: string;
  isCurrent: boolean;
};

type SemesterFormProps = {
  sessions: AcademicSessionOption[];
};

const initialState: SemesterActionState = {};

export default function SemesterForm({ sessions }: SemesterFormProps) {
  const [state, formAction, isPending] = useActionState(
    createSemesterAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Create Semester
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Add a semester to an academic session.
        </p>
      </div>

      <div>
        <label
          htmlFor="semester-name"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Semester Name
        </label>
        <input
          id="semester-name"
          name="name"
          type="text"
          placeholder="e.g. First Semester"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
        {state.errors?.name?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label
          htmlFor="academicSessionId"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Academic Session
        </label>
        <select
          id="academicSessionId"
          name="academicSessionId"
          required
          defaultValue=""
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        >
          <option value="" disabled>
            Select an academic session
          </option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
              {session.isCurrent ? " (Current)" : ""}
            </option>
          ))}
        </select>
        {state.errors?.academicSessionId?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      {sessions.length === 0 && (
        <p className="text-sm text-amber-700">
          Create an academic session before adding a semester.
        </p>
      )}

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
        disabled={isPending || sessions.length === 0}
        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Semester"}
      </button>
    </form>
  );
}
