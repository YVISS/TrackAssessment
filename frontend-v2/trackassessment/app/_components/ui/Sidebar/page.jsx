import LogoutButton from "../../LogoutButton";
import SidebarLinks from "./SidebarLinks/page";
import ProfileButton from "../../ProfileButton";
export default async function Sidebar() {

  return (
    <div className="bg-stone-900 absolute left-0 top-0 min-h-screen w-60 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-stone-400/80 text-sm">Track Assessment</p>
      </div>

      <SidebarLinks></SidebarLinks>

      <div className="flex flex-col gap-2">
        <ProfileButton></ProfileButton>
        <LogoutButton>Log Out</LogoutButton>
      </div>
    </div>

  );
}
