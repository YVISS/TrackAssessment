"use client";
import { supabase } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.push("/signin");
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
