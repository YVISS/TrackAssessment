import LogoutButton from "../../LogoutButton";
import SidebarLinks from "./SidebarLinks/page";
import ProfileButton from "../../ProfileButton";
export default function Sidebar() {
  return (
    <div className="bg-stone-900 absolute left-0 top-0 min-h-screen w-100 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-stone-400/60 text-lg">Track Assessment</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hover:cursor-pointer icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
          <path d="M9 4v16" />
          <path d="M15 10l-2 2l2 2" />
        </svg>
      </div>

      <SidebarLinks></SidebarLinks>

      <div className="flex flex-col gap-2">
        <ProfileButton></ProfileButton>
        <LogoutButton>Log Out</LogoutButton>
      </div>
    </div>
  );
}
