
"use client";

import { useActionState } from "react";
import {
  updateSemesterAction,
  type SemesterActionState,
} from "./actions";

type SessionOption = {
  id: string;
  name: string;
};

type EditSemesterFormProps = {
  id: string;
  name: string;
  academicSessionId: string;
  sessions: SessionOption[];
};

const initialState: SemesterActionState = {};

export default function EditSemesterForm({
  id,
  name,
  academicSessionId,
  sessions,
}: EditSemesterFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateSemesterAction,
    initialState
  );

  return (
    <details>
      <summary className="cursor-pointer text-xs font-medium text-blue-700 hover:text-blue-900">
        Edit
      </summary>

      <form action={formAction} className="mt-3 min-w-64 space-y-3">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Semester Name
          </label>
          <input
            name="name"
            type="text"
            defaultValue={name}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state.errors?.name?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Academic Session
          </label>
          <select
            name="academicSessionId"
            defaultValue={academicSessionId}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
          {state.errors?.academicSessionId?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        {state.message && (
          <p
            role="status"
            className={`text-xs ${
              state.success ? "text-green-700" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </details>
  );
}
