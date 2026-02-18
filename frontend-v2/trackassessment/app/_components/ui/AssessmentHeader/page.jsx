"use client";
import { usePathname } from "next/navigation";

export default function AssessmentHeader() {
  const currentPath = usePathname();

  if (currentPath != "/directions") {
    return (
      <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold">Exam</h1>
        <a href="/dashboard">Back to Home</a>
      </div>
    );
  }

  return(
    <div className="max-w-4xl mx-auto p-6"></div>
  )
}
