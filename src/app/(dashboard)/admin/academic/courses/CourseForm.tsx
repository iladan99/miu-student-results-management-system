
"use client";

import { useRef, useState, useTransition } from "react";
import { createCourseAction } from "./actions";

type Option = {
  id: string;
  name: string;
};

type Props = {
  departments: Option[];
  academicLevels: Option[];
};

export default function CourseForm({
  departments,
  academicLevels,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      const result = await createCourseAction(formData);
      setMessage(result.message);

      if (result.success) {
        formRef.current?.reset();
      }
    });
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Register New Course
      </h2>

      <form
        action={handleSubmit}
        ref={formRef}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="code" className="mb-1 block text-sm font-medium">
              Course Code
            </label>
            <input
              id="code"
              name="code"
              required
              maxLength={20}
              placeholder="e.g. CSC 201"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Course Title
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={150}
              placeholder="e.g. Data Structures"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="creditUnits"
              className="mb-1 block text-sm font-medium"
            >
              Credit Units
            </label>
            <input
              id="creditUnits"
              name="creditUnits"
              type="number"
              min="1"
              max="10"
              defaultValue="3"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="departmentId"
              className="mb-1 block text-sm font-medium"
            >
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              required
              defaultValue=""
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
          </div>

          <div>
            <label
              htmlFor="academicLevelId"
              className="mb-1 block text-sm font-medium"
            >
              Academic Level
            </label>
            <select
              id="academicLevelId"
              name="academicLevelId"
              required
              defaultValue=""
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select level
              </option>
              {academicLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="courseType"
              className="mb-1 block text-sm font-medium"
            >
              Course Type
            </label>
            <select
              id="courseType"
              name="courseType"
              defaultValue="COMPULSORY"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="COMPULSORY">Compulsory</option>
              <option value="ELECTIVE">Elective</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            maxLength={1000}
            placeholder="Brief course description"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={
            isPending ||
            departments.length === 0 ||
            academicLevels.length === 0
          }
          className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Register Course"}
        </button>

        {message && (
          <p aria-live="polite" className="text-sm text-gray-700">
            {message}
          </p>
        )}

        {(departments.length === 0 || academicLevels.length === 0) && (
          <p className="text-sm text-amber-700">
            Add at least one department and one academic level before
            registering courses.
          </p>
        )}
      </form>
    </section>
  );
}
