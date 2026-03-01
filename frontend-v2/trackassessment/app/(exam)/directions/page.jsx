"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const redirectToTest = () => {
    router.replace("/riasec2/VA");
  }

  const handleCheckboxChange = (event) => {
    setIsReady(event.target.checked);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6 rounded-lg shadow-slate-200/20 border border-slate-200/10 shadow-2xl p-8 bg-slate-950/20">
        <h1 className="text-4xl font-bold">Directions</h1>
        <h2 className="text-xl">
          Please read the following instructions carefully before starting the test. Each part will have specific guidelines on how you will answer them. There will be no time limit but we recommend you to complete the test in one sitting. Make sure to find a quiet and comfortable environment to take the test. When you are ready, check the box below and click the "Start" button to begin. Good luck!
        </h2>
        <div className="flex flex-row gap-2 items-center">
          <input
            type="checkbox"
            name="ready-radio"
            onChange={handleCheckboxChange}
            className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor="ready-radio">I am Ready to take the Test</label>
        </div>
          <button onClick={redirectToTest} disabled={!isReady} className="flex items-center justify-center w-full text-xl px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all durverbalability/pageation-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600">Start</button>
      </div>
      
    </div>
  );
}
