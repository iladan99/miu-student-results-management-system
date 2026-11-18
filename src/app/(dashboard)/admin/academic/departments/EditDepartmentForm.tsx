
"use client";

import { useActionState } from "react";
import {
  updateDepartmentAction,
  type DepartmentActionState,
} from "./actions";

type FacultyOption = {
  id: string;
  name: string;
  code: string;
};

type EditDepartmentFormProps = {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  faculties: FacultyOption[];
};

const initialState: DepartmentActionState = {};

export default function EditDepartmentForm({
  id,
  name,
  code,
  facultyId,
  faculties,
}: EditDepartmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateDepartmentAction,
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
            Department Name
          </label>
          <input
            name="name"
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
            Department Code
          </label>
          <input
            name="code"
            defaultValue={code}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
          />
          {state.errors?.code?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Faculty
          </label>
          <select
            name="facultyId"
            defaultValue={facultyId}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.code})
              </option>
            ))}
          </select>
          {state.errors?.facultyId?.map((error) => (
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
