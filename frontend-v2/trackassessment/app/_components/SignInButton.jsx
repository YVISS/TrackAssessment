import Link from "next/link";
export default async function SignInButton() {
  return (
    <Link
      href="/login"
      className="mb-4 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 ease-in-out duration-300"
    >
      Get Started
    </Link>
  );
}
