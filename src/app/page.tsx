
import Image from "next/image";
import Link from "next/link";

const portalRoles = [
  {
    title: "Administrator",
    description:
      "Manage students, lecturers, academic sessions, departments, courses and result approvals.",
  },
  {
    title: "Lecturer",
    description:
      "Access assigned courses, manage student scores and submit semester results for approval.",
  },
  {
    title: "Student",
    description:
      "Register courses, view approved academic results and monitor GPA and CGPA.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sm:px-12">
        <div className="flex items-center gap-3">
          <Image
            src="/images/miu-logo.jpg"
            alt="Mewar International University logo"
            width={64}
            height={64}
            className="h-14 w-14 object-contain"
            priority
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-blue-900">
              MIU
            </h1>
            <p className="text-xs text-slate-500">
              Mewar International University
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Portal Login
        </Link>
      </header>

      {/* Main introduction section */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-[0.08] sm:w-1/2">
          <Image
            src="/images/miu-watermark.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-800">
            Mewar International University
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Student Results
            <span className="block text-blue-900">
              Management System
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            A centralised academic platform developed as a final-year
            project for managing student records, course registrations,
            semester results and academic performance. It provides
            administrators, lecturers and students with access to the
            academic services relevant to their roles.
          </p>

          <div className="mt-9">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Login to Portal
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* System access section with a second university background */}
      <section className="relative isolate overflow-hidden px-6 py-16 sm:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]">
          <Image
            src="/images/miu-watermark-2.jpg"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h3 className="text-2xl font-bold text-slate-900">
              System Access
            </h3>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              The system provides different services based on user roles.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {portalRoles.map((role) => (
              <div
                key={role.title}
                className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-sm"
              >
                <h4 className="text-lg font-bold text-blue-900">
                  {role.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-7 text-center">
        <p className="text-sm font-medium text-slate-700">
          Mewar International University
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Student Results Management System
        </p>
        <p className="mt-3 text-xs text-slate-400">
          © {new Date().getFullYear()} Mewar International University.
          All rights reserved.
        </p>
      </footer>
    </main>
  );
}
