
"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createLecturerAction,
  type LecturerActionState,
} from "./actions";

type Option = {
  id: string;
  name: string;
};

type LecturerFormProps = {
  departments: Option[];
};

const initialState: LecturerActionState = {};

export default function LecturerForm({
  departments,
}: LecturerFormProps) {
  const [state, formAction, isPending] = useActionState(
    createLecturerAction,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success, state.credentials?.username]);

  return (
    <div className="space-y-5">
      <form
        ref={formRef}
        action={formAction}
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Register New Lecturer
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Enter the lecturer&apos;s details. A login account will be
            created automatically.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="lecturerFullName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>
            <input
              id="lecturerFullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter lecturer's full name"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {state.errors?.fullName?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="lecturerEmail"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="lecturerEmail"
              name="email"
              type="email"
              required
              placeholder="lecturer@example.com"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {state.errors?.email?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="lecturerStaffNumber"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Staff Number
            </label>
            <input
              id="lecturerStaffNumber"
              name="staffNumber"
              type="text"
              required
              placeholder="e.g. MIU/STAFF/001"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
            />
            {state.errors?.staffNumber?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="lecturerDepartment"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Department
            </label>
            <select
              id="lecturerDepartment"
              name="departmentId"
              defaultValue=""
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select department
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            {state.errors?.departmentId?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        </div>

        {departments.length === 0 && (
          <p className="text-sm text-amber-700">
            Register a department before registering lecturers.
          </p>
        )}

        {state.message && !state.success && (
          <p role="alert" className="text-sm text-red-600">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || departments.length === 0}
          className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Registering Lecturer..." : "Register Lecturer"}
        </button>
      </form>

      {state.success && state.credentials && (
        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-5">
          <h3 className="font-semibold text-green-900">
            Lecturer Account Created
          </h3>

          <p className="text-sm text-green-800">
            {state.message}
          </p>

          <div className="space-y-2 rounded-md border border-green-200 bg-white p-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Username
              </p>
              <p className="font-mono text-sm text-slate-900">
                {state.credentials.username}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Temporary Password
              </p>
              <p className="break-all font-mono text-sm text-slate-900">
                {state.credentials.password}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-green-900">
            Save these credentials securely. The password will not be
            displayed again.
          </p>
        </div>
      )}
    </div>
  );
}
