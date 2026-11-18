"use client";

import { useState, useTransition } from "react";
import { createAcademicLevelAction } from "./actions";

export default function AcademicLevelForm() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      const result = await createAcademicLevelAction(formData);
      setMessage(result.message);

      if (result.success) {
        const form = document.getElementById(
          "academic-level-form"
        ) as HTMLFormElement | null;

        form?.reset();
      }
    });
  }

  return (
    <form
      id="academic-level-form"
      action={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-5"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        Add Academic Level
      </h2>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Level Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. 500 Level"
          required
          maxLength={50}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="levelNumber"
          className="mb-1 block text-sm font-medium"
        >
          Level Number
        </label>
        <input
          id="levelNumber"
          name="levelNumber"
          type="number"
          min="1"
          max="1000"
          placeholder="e.g. 500"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add Level"}
      </button>

      {message && (
        <p aria-live="polite" className="text-sm text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
}