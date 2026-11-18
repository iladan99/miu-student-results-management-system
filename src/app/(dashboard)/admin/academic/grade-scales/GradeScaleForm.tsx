
"use client";

import { useActionState } from "react";
import {
  saveGradeScaleAction,
  type GradeScaleActionState,
} from "./actions";

type GradeBand = {
  letterGrade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
};

type GradeScaleFormProps = {
  bands: GradeBand[];
};

const initialState: GradeScaleActionState = {
  success: false,
  message: "",
};

export default function GradeScaleForm({
  bands,
}: GradeScaleFormProps) {
  const [state, formAction, pending] = useActionState(
    saveGradeScaleAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Minimum Score</th>
              <th className="px-4 py-3">Maximum Score</th>
              <th className="px-4 py-3">Grade Point</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {bands.map((band) => (
              <tr key={band.letterGrade}>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {band.letterGrade}
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    name={`${band.letterGrade}_minScore`}
                    min="0"
                    max="100"
                    step="1"
                    defaultValue={band.minScore}
                    required
                    aria-label={`${band.letterGrade} minimum score`}
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
                  />
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    name={`${band.letterGrade}_maxScore`}
                    min="0"
                    max="100"
                    step="1"
                    defaultValue={band.maxScore}
                    required
                    aria-label={`${band.letterGrade} maximum score`}
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
                  />
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    name={`${band.letterGrade}_gradePoint`}
                    min="0"
                    max="5"
                    step="0.01"
                    defaultValue={band.gradePoint.toFixed(2)}
                    required
                    aria-label={`${band.letterGrade} grade point`}
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">
        The grading ranges must cover all scores from 0 to 100
        without gaps or overlaps.
      </p>

      {state.message && (
        <p
          aria-live="polite"
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Grading Scale"}
      </button>
    </form>
  );
}
