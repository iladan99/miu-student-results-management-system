
"use client";

import { useState, useTransition } from "react";
import { updateCourseAction } from "./actions";

type Option = {
  id: string;
  name: string;
};

type Props = {
  course: {
    id: string;
    code: string;
    title: string;
    description: string | null;
    creditUnits: number;
    departmentId: string;
    academicLevelId: string;
    courseType: "COMPULSORY" | "ELECTIVE";
  };
  departments: Option[];
  academicLevels: Option[];
};

export default function EditCourseForm({
  course,
  departments,
  academicLevels,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      const result = await updateCourseAction(course.id, formData);
      setMessage(result.message);

      if (result.success) {
        setIsOpen(false);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setMessage("");
          setIsOpen(!isOpen);
        }}
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        {isOpen ? "Cancel" : "Edit"}
      </button>

      {isOpen && (
        <form
          action={handleSubmit}
          className="mt-3 min-w-64 space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium">Course Code</label>
            <input
              name="code"
              defaultValue={course.code}
              required
              maxLength={20}
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Course Title</label>
            <input
              name="title"
              defaultValue={course.title}
              required
              maxLength={150}
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Credit Units</label>
            <input
              name="creditUnits"
              type="number"
              min="1"
              max="10"
              defaultValue={course.creditUnits}
              required
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Department</label>
            <select
              name="departmentId"
              defaultValue={course.departmentId}
              required
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Academic Level</label>
            <select
              name="academicLevelId"
              defaultValue={course.academicLevelId}
              required
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            >
              {academicLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Course Type</label>
            <select
              name="courseType"
              defaultValue={course.courseType}
              required
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            >
              <option value="COMPULSORY">Compulsory</option>
              <option value="ELECTIVE">Elective</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={course.description ?? ""}
              rows={2}
              maxLength={1000}
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-blue-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Save Changes"}
          </button>

          {message && (
            <p aria-live="polite" className="text-xs text-gray-700">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
