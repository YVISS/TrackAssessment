"use client";
import { usePathname } from "next/navigation";

export default function AssessmentHeader() {
  const currentPath = usePathname();

  switch (currentPath) {
    case "/directions":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">Assessment</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
    case "/msa/VA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Verbal Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/msa/NA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Numerical Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/msa/ST":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Science Test</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/msa/CA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Clerical Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/msa/IST":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Interpersonal Skills Test</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/msa/ET":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Entrepreneurship Test</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/VA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Verbal Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/NA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Numerical Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/ST":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Science Test</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/CA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Clerical Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/IST":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Interpersonal Skill Test</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/ET":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Entrepreneurship Test</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/LR":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Logical Reasoning</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/MA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC 2 - Mechanical Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
    default:
      return <div className="max-w-4xl mx-auto p-6"></div>;
    }
}
