"use client";
import { useState } from "react";
import Sidebar from "../_components/ui/Sidebar/page";

export default function DashboardLayout({ children }) {
  const [isShowing, setIsShowing] = useState(true);

  return (
    <div className="dark:bg-transparent relative min-h-screen">
      <div
        className={`fixed inset-y-0 left-0 transition-transform duration-300 z-20 
                            ${isShowing ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>
      <div className="flex items-center p-4 pl-10 border-b border-slate-700/50">
        <button
          aria-label="Toggle sidebar"
          className={`absolute top-4 z-30 rounded-full hover:cursor-pointer transition-transform duration-300 ease-in-out translate-x-0 
                    ${!isShowing ? "left-2 " : "left-60 translate-x-0"}`}
          onClick={() => setIsShowing(!isShowing)}
        >
          {!isShowing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strtokewidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strtokewidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-bar-left"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 12l10 0" />
              <path d="M4 12l4 4" />
              <path d="M4 12l4 -4" />
              <path d="M20 4l0 16" />
            </svg>
          )}
        </button>
        <h1 className="text-slate-400 text-2xl">Dashboard</h1>
      </div>

      <main className={`transition-all duration-300`}>{children}</main>
    </div>
  );
}
