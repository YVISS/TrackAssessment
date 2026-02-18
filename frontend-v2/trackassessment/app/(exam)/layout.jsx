import AssessmentHeader from "../_components/ui/AssessmentHeader/page";

export default function ExamLayout({ children }) {
  return (

    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
      <AssessmentHeader />
      {children}
    </div>
  );
}
