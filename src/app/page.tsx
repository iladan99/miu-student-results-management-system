
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex h-20 items-center justify-between border-b border-border px-6 sm:px-12">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-primary">
            MIU
          </h1>
          <p className="text-xs text-muted">
            Mewar International University
          </p>
        </div>

        <span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary">
          Academic Portal
        </span>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-3xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Mewar International University
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Student Results Management System
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            A central platform for managing academic records, course
            registrations, semester results, and student performance.
          </p>

          <div className="mt-10">
            <span className="inline-flex items-center rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white">
              Portal Setup in Progress
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} Mewar International University.
        All rights reserved.
      </footer>
    </main>
  );
}
