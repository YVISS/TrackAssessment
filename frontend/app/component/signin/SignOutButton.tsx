"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="formbtns flex align-middle justify-center px-6 py-2 gap-1 text-[1vw] border-1 border-transparent hover:border-sky-500 duration-300 transition-color ease-in-out"
    >
      Sign Out
    </button>
  );
}