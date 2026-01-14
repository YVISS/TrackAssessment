
import Link from "next/link";
import LogoutButton from "../../LogoutButton";

export default function Sidebar() {
  return (
    <div className="bg-stone-900 absolute left-0 top-0 min-h-screen w-100 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-stone-400/60 text-lg">Track Assessment</p>
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
          className="hover:cursor-pointer icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
          <path d="M9 4v16" />
          <path d="M15 10l-2 2l2 2" />
        </svg>
      </div>

      <ul className="flex flex-col gap-2">
        <Link className="text-stone-50/30 hover:text-stone-50/90 px-4 py-4 flex rounded-xl items-center justify-start gap-8 text-xl hover:bg-stone-700/60 ease-in-out duration-300" href={"/dashboard"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-smart-home"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19 8.71l-5.333 -4.148a2.666 2.666 0 0 0 -3.274 0l-5.334 4.148a2.665 2.665 0 0 0 -1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-7.2c0 -.823 -.38 -1.6 -1.03 -2.105" />
            <path d="M16 15c-2.21 1.333 -5.792 1.333 -8 0" />
          </svg>
          Home
        </Link>
        <Link className="text-stone-50/30 hover:text-stone-50/90 px-4 py-4 flex rounded-xl items-center justify-start gap-8 text-xl hover:bg-stone-700/60 ease-in-out duration-300" href={"/assessment"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
            <path d="M13.5 6.5l4 4" />
          </svg>
          Assessment
        </Link>
        <Link className="text-stone-50/30 hover:text-stone-50/90 px-4 py-4 flex rounded-xl items-center justify-start gap-8 text-xl hover:bg-stone-700/60 ease-in-out duration-300" href={"/uploading "}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-file-upload"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
            <path d="M12 11v6" />
            <path d="M9.5 13.5l2.5 -2.5l2.5 2.5" />
          </svg>
          Upload
        </Link>
      </ul>

      <div>
        <LogoutButton>Log Out</LogoutButton>
      </div>
    </div>
  );
}
