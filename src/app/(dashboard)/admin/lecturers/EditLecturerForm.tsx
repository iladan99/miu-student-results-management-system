
"use client";

import { useActionState } from "react";
import {
  updateLecturerAction,
  type LecturerActionState,
} from "./actions";

type Option = {
  id: string;
  name: string;
};

type LecturerData = {
  id: string;
  staffNumber: string;
  departmentId: string;
  user: {
    fullName: string;
    email: string;
  };
};

type EditLecturerFormProps = {
  lecturer: LecturerData;
  departments: Option[];
};

const initialState: LecturerActionState = {};

export default function EditLecturerForm({
  lecturer,
  departments,
}: EditLecturerFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateLecturerAction,
    initialState
  );
  
  return (
    <details className="min-w-40">
      <summary className="cursor-pointer text-sm font-medium text-blue-700 hover:underline">
        Edit details
      </summary>

      <form
        action={formAction}
        className="mt-3 w-72 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3"
      >
        <input type="hidden" name="id" value={lecturer.id} />

        <div>
          <label
            htmlFor={`edit-name-${lecturer.id}`}
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            id={`edit-name-${lecturer.id}`}
            name="fullName"
            type="text"
            required
            defaultValue={lecturer.user.fullName}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          {state.errors?.fullName?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div>
          <label
            htmlFor={`edit-email-${lecturer.id}`}
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Email Address
          </label>
          <input
            id={`edit-email-${lecturer.id}`}
            name="email"
            type="email"
            required
            defaultValue={lecturer.user.email}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          {state.errors?.email?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div>
          <label
            htmlFor={`edit-staff-${lecturer.id}`}
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Staff Number
          </label>
          <input
            id={`edit-staff-${lecturer.id}`}
            name="staffNumber"
            type="text"
            required
            defaultValue={lecturer.staffNumber}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm uppercase"
          />
          {state.errors?.staffNumber?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div>
          <label
            htmlFor={`edit-department-${lecturer.id}`}
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Department
          </label>
          <select
            id={`edit-department-${lecturer.id}`}
            name="departmentId"
            defaultValue={lecturer.departmentId}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {state.errors?.departmentId?.map((error) => (
            <p key={error} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ))}
        </div>

        {state.message && (
          <p
            role={state.success ? "status" : "alert"}
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
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </details>
  );
}
