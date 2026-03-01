"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [isReady, setIsReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const redirectToTest = () => {
    setIsStarting(true);
    toast.info("Starting the assessment...");
    router.replace("/riasec2/VA");
  };

  const handleCheckboxChange = (event) => {
    setIsReady(event.target.checked);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6 rounded-lg shadow-slate-200/20 border border-slate-200/10 shadow-2xl p-8 bg-slate-950/20">
        <h1 className="text-4xl font-bold">Directions</h1>
        <h2 className="text-xl">
          Please read the following instructions carefully before starting the test. Each part will have specific guidelines on how you will answer them. There will be no time limit but we recommend you to complete the test in one sitting. Make sure to find a quiet and comfortable environment to take the test. When you are ready, check the box below and click the &quot;Start&quot; button to begin. Good luck!
        </h2>
        <div className={`flex flex-row gap-2 items-center p-3 rounded-lg transition-colors duration-300 ${isReady ? "bg-green-500/10 border border-green-500/30" : ""}`}>
          <input
            type="checkbox"
            id="ready-radio"
            name="ready-radio"
            onChange={handleCheckboxChange}
            className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor="ready-radio" className={`cursor-pointer transition-colors duration-300 ${isReady ? "text-green-400 font-medium" : ""}`}>
            {isReady && <span className="mr-1" aria-hidden="true">✓</span>}
            I am Ready to take the Test
          </label>
        </div>
        <button
          onClick={redirectToTest}
          disabled={!isReady || isStarting}
          className="flex items-center justify-center w-full text-xl px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          {isStarting && (
            <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
          )}
          {isStarting ? "Starting..." : "Start"}
        </button>
      </div>
    </div>
  );
}
