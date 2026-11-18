"use client";

import { useState, useTransition } from "react";
import { updateAcademicLevelAction } from "./actions";

type Props = {
  id: string;
  name: string;
  levelNumber: number;
};

export default function EditAcademicLevelForm({
  id,
  name,
  levelNumber,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      const result = await updateAcademicLevelAction(id, formData);
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
          className="mt-3 min-w-56 space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium">
              Level Name
            </label>
            <input
              name="name"
              defaultValue={name}
              required
              maxLength={50}
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">
              Level Number
            </label>
            <input
              name="levelNumber"
              type="number"
              min="1"
              max="1000"
              defaultValue={levelNumber}
              required
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