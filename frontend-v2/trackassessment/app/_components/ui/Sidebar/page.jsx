import LogoutButton from "../../LogoutButton";
import SidebarLinks from "./SidebarLinks/page";
import ProfileButton from "../ProfileButton/ProfileButton";
import { Suspense } from "react";
export default function Sidebar() {
  return (
    <div className="relative bg-stone-900 left-0 top-0 min-h-screen w-60 p-6 flex flex-col justify-between duration-300 ">

      <div className="flex items-center justify-end">
        <p className="text-stone-400/80 text-sm">Track Assessment</p>
      </div>

      <SidebarLinks></SidebarLinks>

      <div className="flex flex-col gap-2">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileButton />
        </Suspense>


        <LogoutButton></LogoutButton>
      </div>

    </div>

  );
}
