
"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createStudentAction,
  type StudentActionState,
} from "./actions";

type Option = {
  id: string;
  name: string;
};

type AcademicLevelOption = {
  id: string;
  name: string;
  levelNumber: number;
};

type StudentFormProps = {
  departments: Option[];
  academicSessions: Option[];
  academicLevels: AcademicLevelOption[];
};

const initialState: StudentActionState = {};

export default function StudentForm({
  departments,
  academicSessions,
  academicLevels,
}: StudentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createStudentAction,
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
            Register New Student
          </h3>
          <p className="mt-1 text-sm text-slate-500">
          Enter the student&apos;s personal and academic information.
            A login account will be created automatically.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter student's full name"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {state.errors?.fullName?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="student@example.com"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {state.errors?.email?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          <div>
            <label htmlFor="registrationNo" className="mb-1 block text-sm font-medium text-slate-700">
              Registration Number
            </label>
            <input
              id="registrationNo"
              name="registrationNo"
              type="text"
              required
              placeholder="e.g. MIU/23/CMP/SEN/107"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
            />
            {state.errors?.registrationNo?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          <div>
            <label htmlFor="admissionYear" className="mb-1 block text-sm font-medium text-slate-700">
              Admission Year
            </label>
            <input
              id="admissionYear"
              name="admissionYear"
              type="number"
              min="2000"
              max="2100"
              required
              placeholder="e.g. 2023"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {state.errors?.admissionYear?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          <div>
            <label htmlFor="departmentId" className="mb-1 block text-sm font-medium text-slate-700">
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              defaultValue=""
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="" disabled>Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            {state.errors?.departmentId?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          <div>
            <label htmlFor="academicSessionId" className="mb-1 block text-sm font-medium text-slate-700">
              Academic Session
            </label>
            <select
              id="academicSessionId"
              name="academicSessionId"
              defaultValue=""
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="" disabled>Select academic session</option>
              {academicSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
            {state.errors?.academicSessionId?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          <div>
            <label htmlFor="academicLevelId" className="mb-1 block text-sm font-medium text-slate-700">
              Academic Level
            </label>
            <select
              id="academicLevelId"
              name="academicLevelId"
              defaultValue=""
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="" disabled>Select academic level</option>
              {academicLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
            {state.errors?.academicLevelId?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>
        </div>

        {departments.length === 0 && (
          <p className="text-sm text-amber-700">
            Register a department before registering students.
          </p>
        )}

        {academicSessions.length === 0 && (
          <p className="text-sm text-amber-700">
            Create an academic session before registering students.
          </p>
        )}

        {academicLevels.length === 0 && (
          <p className="text-sm text-amber-700">
            Create academic levels before registering students.
          </p>
        )}

        {state.message && !state.success && (
          <p role="alert" className="text-sm text-red-600">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={
            isPending ||
            departments.length === 0 ||
            academicSessions.length === 0 ||
            academicLevels.length === 0
          }
          className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Registering Student..." : "Register Student"}
        </button>
      </form>

      {state.success && state.credentials && (
        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-5">
          <h3 className="font-semibold text-green-900">
            Student Account Created
          </h3>

          <p className="text-sm text-green-800">
            {state.message}
          </p>

          <div className="space-y-2 rounded-md border border-green-200 bg-white p-4">
            <div>
              <p className="text-xs font-medium text-slate-500">Username</p>
              <p className="font-mono text-sm text-slate-900">
                {state.credentials.username}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Temporary Password</p>
              <p className="break-all font-mono text-sm text-slate-900">
                {state.credentials.password}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-green-900">
            Save these credentials now. The password will not be displayed again.
          </p>
        </div>
      )}
    </div>
  );
}
