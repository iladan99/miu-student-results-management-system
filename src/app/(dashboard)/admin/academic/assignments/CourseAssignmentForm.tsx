
"use client";

import { useActionState } from "react";
import {
  createCourseAssignmentAction,
  type CourseAssignmentActionState,
} from "./actions";

type Props = {
  lecturers: {
    id: string;
    staffNumber: string;
    user: {
      fullName: string;
    };
    department: {
      name: string;
    };
  }[];

  courses: {
    id: string;
    code: string;
    title: string;
    department: {
      name: string;
    };
  }[];

  academicSessions: {
    id: string;
    name: string;
    semesters: {
      id: string;
      name: string;
    }[];
  }[];
};

const initialState: CourseAssignmentActionState = {
  success: false,
  message: "",
};

export default function CourseAssignmentForm({
  lecturers,
  courses,
  academicSessions,
}: Props) {
  const [state, formAction, pending] = useActionState(
    createCourseAssignmentAction,
    initialState
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-5">
        <h3 className="font-semibold text-slate-900">
          Assign Course to Lecturer
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Select the lecturer, course, academic session and semester.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="lecturerId"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Lecturer
            </label>

            <select
              id="lecturerId"
              name="lecturerId"
              required
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select lecturer
              </option>

              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.user.fullName} ({lecturer.staffNumber}) -{" "}
                  {lecturer.department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="courseId"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Course
            </label>

            <select
              id="courseId"
              name="courseId"
              required
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select course
              </option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title} ({course.department.name})
                </option>
              ))}
            </select>
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select academic session
              </option>

              {academicSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="semesterId"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Semester
            </label>

            <select
              id="semesterId"
              name="semesterId"
              required
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select semester
              </option>

              {academicSessions.map((session) =>
                session.semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {session.name} - {semester.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {state.message && (
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              state.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Assigning course..." : "Assign Course"}
        </button>
      </form>

      {lecturers.length === 0 && (
        <p className="mt-3 text-sm text-amber-700">
          No active lecturers are available. Register or reactivate a lecturer first.
        </p>
      )}

      {courses.length === 0 && (
        <p className="mt-2 text-sm text-amber-700">
          No active courses are available. Register or activate a course first.
        </p>
      )}
    </div>
  );
}
