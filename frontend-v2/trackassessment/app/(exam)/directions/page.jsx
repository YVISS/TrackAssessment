"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [isReady, setIsReady] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsReady(event.target.checked);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6 rounded-lg shadow-slate-200/20 border border-slate-200/10 shadow-2xl p-8 bg-slate-950/20">
        <h1 className="text-4xl font-bold">Directions</h1>
        <h2 className="text-xl">
          This is a test of your verbal aptitude and your proficiency in
          standard written English. It consists of six parts; identifying
          errors, sentence completion, sentence correction, vocabulary, reading
          comprehension, and paragraph organization. You will answer this test
          within <strong>65 mins</strong>.
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
        <button onClick={() => window.location.href = "/dashboard"} disabled={!isReady} className="flex items-center justify-center w-full text-xl px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600">Start</button>
      </div>
      
    </div>
  );
}
