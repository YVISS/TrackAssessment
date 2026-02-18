"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLinks() {
  const currentPath = usePathname();
  const navItems = [
    // Dashboard
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strtokewidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-layout-dashboard"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" />
          <path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" />
          <path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" />
          <path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" />
        </svg>
      ),
    },
    // Assessment
    {
      href: "/directions",
      label: "Assessment",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strtokewidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      ),
    },
    // Uploadsx
  ];
  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {navItems.map((items) => {
          const isActive = currentPath === items.href;
          return (
            <Link
              href={items.href}
              key={items.href}
              className={`text-stone-50/30 px-4 py-4 flex items-center justify-start gap-2 text-md rounded-xl hover:text-stone-50/90 hover:bg-stone-700/60 ease-in-out duration-300 
                        ${
                          isActive
                            ? "bg-stone-700/60 text-stone-50/90"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
            >
              {" "}
              {items.icon}
              {items.label}
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}
