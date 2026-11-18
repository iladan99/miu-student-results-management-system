
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getGradeScaleConfiguration } from "@/services/grade-scale";
import GradeScaleForm from "./GradeScaleForm";

export default async function GradeScalePage() {
  await requireRole(["ADMIN", "ADMINISTRATOR"]);

  const bands = await getGradeScaleConfiguration();

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/admin/academic"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Academic Administration
        </Link>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Grade Scale Management
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Configure the score ranges and grade points used to
          calculate student results.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">
          Grading Configuration
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          These settings determine the letter grade and grade
          point automatically assigned to each student&apos;s total
          score.
        </p>

        <div className="mt-5">
          <GradeScaleForm bands={bands} />
        </div>
      </div>
    </section>
  );
}
