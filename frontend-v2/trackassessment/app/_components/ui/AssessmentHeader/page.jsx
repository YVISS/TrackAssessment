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
      case "/msa/LR":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Logical Reasoning</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/msa/MA":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">MSA - Mechanical Ability</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/R":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC - Realistic</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/I":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC - Invesigative</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/A":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC - Artistic</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/S":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC - Social</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/E":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC - Enterprising</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
      case "/riasec2/C":
      return (
        <div className="flex items-center justify-between mb-8 mx-auto max-w-4xl p-6">
          <h1 className="text-3xl font-bold">RIASEC - Conventional</h1>
          <a href="/dashboard">Back to Home</a>
        </div>
      );
    default:
      return <div className="max-w-4xl mx-auto p-6"></div>;
    }
}
