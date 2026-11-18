
"use client";

import { useActionState } from "react";
import {
  updateStudentAction,
  type StudentActionState,
} from "./actions";

type StudentForEdit = {
  id: string;
  registrationNo: string;
  departmentId: string;
  admissionYear: number;
  user: {
    fullName: string;
    email: string;
  };
};

type DepartmentOption = {
  id: string;
  name: string;
};

type Props = {
  student: StudentForEdit;
  departments: DepartmentOption[];
};

const initialState: StudentActionState = {};

export default function EditStudentForm({
  student,
  departments,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    updateStudentAction,
    initialState
  );

  return (
    <details className="text-left">
      <summary className="cursor-pointer text-sm font-medium text-blue-700 hover:underline">
        Edit record
      </summary>

      <form action={formAction} className="mt-3 min-w-64 space-y-3">
        <input type="hidden" name="id" value={student.id} />

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Full Name
          </label>
          <input
            name="fullName"
            defaultValue={student.user.fullName}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state.errors?.fullName?.map((error) => (
            <p key={error} className="text-xs text-red-600">{error}</p>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            defaultValue={student.user.email}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state.errors?.email?.map((error) => (
            <p key={error} className="text-xs text-red-600">{error}</p>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Registration Number
          </label>
          <input
            name="registrationNo"
            defaultValue={student.registrationNo}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
          />
          {state.errors?.registrationNo?.map((error) => (
            <p key={error} className="text-xs text-red-600">{error}</p>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Department
          </label>
          <select
            name="departmentId"
            defaultValue={student.departmentId}
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
            <p key={error} className="text-xs text-red-600">{error}</p>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Admission Year
          </label>
          <input
            name="admissionYear"
            type="number"
            min="2000"
            max="2100"
            defaultValue={student.admissionYear}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state.errors?.admissionYear?.map((error) => (
            <p key={error} className="text-xs text-red-600">{error}</p>
          ))}
        </div>

        {state.message && (
          <p
            className={`text-sm ${
              state.success ? "text-green-700" : "text-red-600"
            }`}
            role="status"
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
