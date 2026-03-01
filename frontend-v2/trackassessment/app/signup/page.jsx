import Link from "next/link";
import { signup } from "../(auth)/actions";
import { redirectIfAuthenticated } from "../../utils/redirectIfAuthenticated";
import SubmitButton from "../_components/SubmitButton";

export default async function SignUpPage() {
  await redirectIfAuthenticated();
  return (
    <div className="flex items-center justify-center min-h-screen w-full font-sans bg-slate-900">
      <div className=" text-slate-50 border-slate-700 border rounded-xl p-10 h-100 w-auto shadow-2xl shadow-slate-900/50">
        <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
        <form action={signup} className="space-y-4 flex flex-col min-h-auto">
          <div className="space-y-4">
            <label htmlFor="email" className="block text-sm text-zinc-300">
              Email
            </label>
            <p id="alert-message text-white"></p>
            <input
              className="border-sky-500/30 border rounded py-2 px-4 w-100 
              focus:outline-2 focus:outline-sky-500 focus:outline-offset-2"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="password" className="block text-sm text-zinc-300">
              Password
            </label>
            <input
              className="border-sky-500/30 border rounded py-2 px-4 w-100 
              focus:outline-2 focus:outline-sky-500 focus:outline-offset-2"
              type="password"
              name="password"
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="pt-2">
            <SubmitButton pendingText="Signing Up...">Sign Up</SubmitButton>
          </div>

          <div className="space-y-4 flex justify-between">
            <p className="text-slate-400">Already have an account?</p>
            <Link
                href={'/login'}
                className="hover:underline"
            >
                Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
