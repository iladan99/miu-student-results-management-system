
"use client";

import { useActionState } from "react";
import {
  createDepartmentAction,
  type DepartmentActionState,
} from "./actions";

type FacultyOption = {
  id: string;
  name: string;
  code: string;
};

type DepartmentFormProps = {
  faculties: FacultyOption[];
};

const initialState: DepartmentActionState = {};

export default function DepartmentForm({
  faculties,
}: DepartmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createDepartmentAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Register Department
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Create a department and assign it to a faculty.
        </p>
      </div>

      <div>
        <label
          htmlFor="department-name"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Department Name
        </label>
        <input
          id="department-name"
          name="name"
          type="text"
          placeholder="e.g. Software Engineering"
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
        <label
          htmlFor="department-code"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Department Code
        </label>
        <input
          id="department-code"
          name="code"
          type="text"
          placeholder="e.g. SWE"
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
        <label
          htmlFor="facultyId"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Faculty
        </label>
        <select
          id="facultyId"
          name="facultyId"
          defaultValue=""
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a faculty
          </option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name} ({faculty.code})
            </option>
          ))}
        </select>
        {state.errors?.facultyId?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      {faculties.length === 0 && (
        <p className="text-sm text-amber-700">
          Register a faculty before creating a department.
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
        disabled={isPending || faculties.length === 0}
        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Create Department"}
      </button>
    </form>
  );
}
