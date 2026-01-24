import { redirectIfAuthenticated } from "../utils/redirectIfAuthenticated";
import SignInButton from "./_components/SignInButton";
import SignUpButton from "./_components/SignUpButton";

export default async function LandingPage() {
  await redirectIfAuthenticated();
  return (
    <div className="flex min-h-screen items-center justify-center light:bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-transparent sm:items-start">
        <h1 className="text-5xl">Welcome to Track Assessment</h1>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <SignInButton/>
          <SignUpButton/>
          
        </div>
      </main>
    </div>
  );
}
