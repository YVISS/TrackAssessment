import { redirectIfAuthenticated } from "../utils/redirectIfAuthenticated";
import SignInButton from "./_components/SignInButton";
import SignUpButton from "./_components/SignUpButton";

export default async function LandingPage() {
  await redirectIfAuthenticated();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-slate-900 dark:bg-black dark:text-slate-50">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -bottom-24 right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(226,232,240,0.10)_1px,transparent_0)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left: hero copy */}
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-black/40 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Career assessment made simple
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Track Assessment
              <span className="block text-slate-600 dark:text-slate-300">
                Understand strengths. Build a clearer path.
              </span>
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Take structured assessments and get organized results—designed to
              help you reflect, improve, and move forward with confidence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SignInButton />
              <SignUpButton />
              <a
                href="/login"
                className="text-sm text-slate-600 underline-offset-4 hover:underline dark:text-slate-300"
              >
                Already have an account?
              </a>
            </div>

            <dl className="grid max-w-xl grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur dark:border-slate-800 dark:bg-black/30">
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  Fast start
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  Sign in and begin in minutes
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur dark:border-slate-800 dark:bg-black/30">
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  Guided flow
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  Clear steps through each module
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur dark:border-slate-800 dark:bg-black/30">
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  Results
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  Track progress and outcomes
                </dd>
              </div>
            </dl>
          </section>

          {/* Right: preview card */}
          <aside className="lg:justify-self-end">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-black/40 dark:shadow-black/40 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">What you’ll do</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    A short, structured flow to help you discover and organize
                    insights.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                  Beta
                </div>
              </div>

              <ol className="mt-6 space-y-4">
                <li className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-sm font-semibold text-white">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Read directions</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Understand the assessment format and pacing.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Complete modules</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Work through categories with an easy step-by-step flow.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-semibold text-white">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Review your dashboard</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      See progress and continue where you left off.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                Tip: Use a quiet space and complete the assessment in one sitting
                if possible.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}