"use client";

import { useState, useEffect } from "react";
import { submitExamAnswers } from "../actions";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function TakeExamPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuestions() {
      const supabase = createClient();

      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch questions from Questionnaires table
      const { data, error } = await supabase
        .from("VerbalAbility")
        .select("number, Questions, A, B, C, D, Answers")
        .order("number", { ascending: true });

      if (error) {
        console.error("Error fetching questions:", error);
      } else {
        setQuestions(data || []);
      }
      setLoading(false);
    }

    fetchQuestions();
  }, [router]);

  const handleAnswerChange = (questionNumber, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Calculate score
    let correct = 0;
    let total = questions.length;

    questions.forEach((q) => {
      if (answers[q.number] === q.Answers) {
        correct++;
      }
    });

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    setResult({
      correct,
      total,
      score,
      answers: answers,
    });

    setSubmitting(false);
  };

  const resetExam = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading exam...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No questions available.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      

      {result ? (
        <div className="bg-stone-600/10 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Exam Results</h2>
          <div className="text-xl mb-4">
            Score:{" "}
            <span className="font-bold text-purple-500">{result.score}%</span>
          </div>
          <div className="text-lg mb-6">
            Correct Answers: {result.correct} / {result.total}
          </div>

          {/* Show detailed results */}
          <div className="space-y-6">
            {questions.map((question) => {
              const userAnswer = result.answers[question.number];
              const isCorrect = userAnswer === question.Answers;

              return (
                <div
                  key={question.number}
                  className={`p-4 rounded-lg ${isCorrect ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
                >
                  <p className="font-semibold mb-2">
                    {question.number}. {question.Questions};
                  </p>
                  <p className="text-sm">
                    Your answer:{" "}
                    <span
                      className={isCorrect ? "text-green-400" : "text-red-400"}
                    >
                      {userAnswer || "Not answered"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm">
                      Correct answer:{" "}
                      <span className="text-green-400">{question.Answers}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={resetExam}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Take Exam Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question) => (
            <div
              key={question.number}
              className="bg-stone-600/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                {question.number}. {question.Questions}
              </h3>

              <div className="space-y-3">
                {["A", "B", "C", "D"].map((option) => (
                  <label
                    key={option}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-stone-500/10 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${question.number}`}
                      value={option}
                      checked={answers[question.number] === option}
                      onChange={(e) =>
                        handleAnswerChange(question.number, e.target.value)
                      }
                      className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span className="flex-1">
                      <span className="font-semibold">{option}.</span>{" "}
                      {question[option]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={
                submitting || Object.keys(answers).length !== questions.length
              }
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>

          {Object.keys(answers).length < questions.length && (
            <p className="text-center text-sm text-yellow-400">
              Please answer all questions before submitting (
              {Object.keys(answers).length}/{questions.length} answered)
            </p>
          )}
        </form>
      )}
    </div>
  );
}
