import Link from "next/link";

export default async function SignUpButton() {
  return (
    <Link
      href="/signup"
      className="mb-4 inline-block rounded-xl border border-sky-50 px-6 py-3 text-sky-50 hover:bg-blue-50 hover:text-blue-600 ease-in-out duration-300"
    >
      Create an Account
    </Link>
  );
}
