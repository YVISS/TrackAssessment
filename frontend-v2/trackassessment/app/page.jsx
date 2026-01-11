import { redirectIfAuthenticated } from "../utils/redirectIfAuthenticated";
import Link from "next/link";

export default async function LandingPage() {
  await redirectIfAuthenticated();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl">Welcome to Track Assessment</h1>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/login"
            className="mb-4 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 ease-in-out duration-300"
          >
            Get Started
          </Link>
          <Link
            href="/signup"
            className="mb-4 inline-block rounded-xl border border-sky-50 px-6 py-3 text-sky-50 hover:bg-blue-50 hover:text-blue-600 ease-in-out duration-300"
          >
            Create an Account
          </Link>

        </div>
      </main>
    </div>
  );
}
