"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

export default function ProfileButton() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (error || !data?.user) {
        setUser(null);
        router.push("/login");
      } else {
        setUser(data.user);
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!user) return null;

  return (
    <div className="w-full">
      <Link
        href={`/profile/${user.id}`}
        className="w-full flex items-center justify-start"
      >
        {/* optional: replace with avatar/icon */}
        <div className="relative flex w-full items-center px-1 py-2 gap-2 hover:text-stone-50/90 hover:bg-stone-700/60 rounded-xl">
          <span className="text-stone-50/70 text-sm rounded-full bg-stone-400/20 py-2 px-3.5">
            {user.email?.[0]?.toUpperCase() ?? "U"}
          </span>
          <span className="text-sm text-stone-50/70">{user.email?.split("@")[0] ?? "Account"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right text-stone-50/70 absolute right-0"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
          </svg>
    </div>
      </Link >
    </div >
  );
}
