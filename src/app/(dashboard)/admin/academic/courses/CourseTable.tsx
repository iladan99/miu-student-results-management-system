
"use client";

import { useState, useTransition } from "react";
import EditCourseForm from "./EditCourseForm";
import { setCourseStatusAction } from "./actions";

type Option = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  creditUnits: number;
  departmentId: string;
  academicLevelId: string;
  courseType: "COMPULSORY" | "ELECTIVE";
  isActive: boolean;
  department: { name: string };
  academicLevel: { name: string };
  _count: {
    assignments: number;
    registrations: number;
  };
};

type Props = {
  courses: Course[];
  departments: Option[];
  academicLevels: Option[];
};

export default function CourseTable({
  courses,
  departments,
  academicLevels,
}: Props) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredCourses = courses.filter((course) => {
    const term = search.toLowerCase();

    return (
      course.code.toLowerCase().includes(term) ||
      course.title.toLowerCase().includes(term) ||
      course.department.name.toLowerCase().includes(term) ||
      course.academicLevel.name.toLowerCase().includes(term)
    );
  });

  function toggleStatus(course: Course) {
    setMessage("");

    startTransition(async () => {
      const result = await setCourseStatusAction(
        course.id,
        !course.isActive
      );
      setMessage(result.message);
    });
  }

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="space-y-3 border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-gray-900">Registered Courses</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredCourses.length} of {courses.length} course(s) displayed
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by course code, title, department or level..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />

        {message && (
          <p aria-live="polite" className="text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>

      {filteredCourses.length === 0 ? (
        <p className="p-5 text-sm text-gray-500">
          {courses.length === 0
            ? "No courses have been registered yet."
            : "No courses match your search."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assignments</th>
                <th className="px-4 py-3">Registrations</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{course.code}</p>
                    <p className="text-gray-600">{course.title}</p>
                  </td>

                  <td className="px-4 py-4">{course.department.name}</td>
                  <td className="px-4 py-4">{course.academicLevel.name}</td>
                  <td className="px-4 py-4">{course.creditUnits}</td>

                  <td className="px-4 py-4">
                    {course.courseType === "COMPULSORY"
                      ? "Compulsory"
                      : "Elective"}
                  </td>

                  <td className="px-4 py-4">
                    <span className={course.isActive
                      ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                      : "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    }>
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4">{course._count.assignments}</td>
                  <td className="px-4 py-4">{course._count.registrations}</td>

                  <td className="space-y-2 px-4 py-4">
                    <EditCourseForm
                      course={course}
                      departments={departments}
                      academicLevels={academicLevels}
                    />

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => toggleStatus(course)}
                      className="block text-xs font-medium text-gray-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      {course.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
