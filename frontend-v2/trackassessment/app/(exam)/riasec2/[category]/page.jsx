"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { toast } from "sonner";

export default function Riasec2CategoryPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ stable client
  const supabase = useMemo(() => createClient(), []);

  const ASSESSMENT = "riasec2";
  const BASE_PATH = "/riasec2";
  const DONE_REDIRECT = "/msa/VA"; // ✅ riasec2 -> msa

  const categoryCode = useMemo(() => {
    const raw = params?.category;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.question_number] !== undefined);

  // ✅ helper: redirect to next unanswered category (or done)
  const redirectNextUnanswered = (catList, answeredSet) => {
    const nextUnanswered = catList.find((c) => !answeredSet.has(c.id));
    if (nextUnanswered) router.push(`${BASE_PATH}/${nextUnanswered.code}`);
    else router.push(DONE_REDIRECT);
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      setErrorMsg("");

      // 1) Auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!categoryCode) {
        setErrorMsg("Missing category in URL.");
        setLoading(false);
        return;
      }

      // 2) Categories for riasec2 only
      const { data: cats, error: catsErr } = await supabase
        .from("riasec_categories")
        .select("id, code, name")
        .order("id", { ascending: true });

      if (catsErr) {
        console.error(catsErr);
        setErrorMsg("Failed to load categories.");
        setLoading(false);
        return;
      }

      const catList = cats || [];
      if (!catList.length) {
        setErrorMsg("No categories configured for RIASEC2.");
        setLoading(false);
        return;
      }

      setCategories(catList);

      // 3) Resolve current by code
      const current = catList.find((c) => c.code === categoryCode);
      if (!current) {
        router.push(`${BASE_PATH}/${catList[0].code}`);
        return;
      }

      // 4) Validation: already answered -> next unanswered
      const { data: answeredRows, error: ansErr } = await supabase
        .from("riasec_answers")
        .select("category_id")
        .eq("user_id", user.id)
        .in(
          "category_id",
          catList.map((c) => c.id),
        );

      if (ansErr) {
        console.error(ansErr);
        setErrorMsg("Failed to validate progress.");
        setLoading(false);
        return;
      }

      const answeredSet = new Set(
        (answeredRows || []).map((r) => r.category_id),
      );

      if (answeredSet.has(current.id)) {
        redirectNextUnanswered(catList, answeredSet);
        return;
      }

      setCategory(current);

      // 5) Load questions
      const { data: qs, error: qsErr } = await supabase
        .from("riasec_questions")
        .select("question_number, question")
        .eq("category_id", current.id)
        .order("question_number", { ascending: true });

      if (qsErr) {
        console.error(qsErr);
        setErrorMsg("Failed to load questions.");
        setLoading(false);
        return;
      }

      setQuestions(qs || []);
      setAnswers({});
      setLoading(false);
    }

    init();
  }, [categoryCode, router, supabase]);

  const handleAnswerChange = (questionNumber, value) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));
  };

  // ✅ helper: go to next category in order (or done)
  const goNext = () => {
    const idx = categories.findIndex((c) => c.id === category?.id);
    const next = categories[idx + 1];

    if (next) router.push(`${BASE_PATH}/${next.code}`);
    else router.push(DONE_REDIRECT);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return;

    setSubmitting(true);
    setErrorMsg("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const payload = Object.entries(answers).map(([qnum, val]) => ({
        user_id: user.id,
        category_id: category.id,
        question_number: Number(qnum),
        answer: Number(val), // Likert 1..5
      }));

      const { error } = await supabase
        .from("riasec_answers")
        .upsert(payload, { onConflict: "user_id,category_id,question_number" });

      if (error) throw error;

      toast.success("Answers submitted successfully!");
      goNext();
    } catch (err) {
      console.error(err);
      setErrorMsg("Submit failed. Please try again.");
      toast.error("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-stone-600/10 rounded-xl p-6">
          <div className="font-semibold mb-2">Error</div>
          <div className="text-sm opacity-80">{errorMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q) => (
          <div
            key={q.question_number}
            className="bg-stone-600/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">
              {q.question_number}. {q.question}
            </h3>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-500/10 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${q.question_number}`}
                    value={value}
                    checked={answers[q.question_number] === value}
                    onChange={() =>
                      handleAnswerChange(q.question_number, value)
                    }
                  />
                  <span>
                    {value === 1 && `${value} - Strongly Disagree`}
                    {value === 2 && `${value} - Disagree`}
                    {value === 3 && `${value} - Neutral`}
                    {value === 4 && `${value} - Agree`}
                    {value === 5 && `${value} - Strongly Agree`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!allAnswered || submitting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg"
          >
            {submitting ? "Submitting..." : "Finish"}
          </button>
        </div>

        {!allAnswered && (
          <p className="text-center text-sm text-yellow-400">
            Please answer all questions ({Object.keys(answers).length}/
            {questions.length})
          </p>
        )}
      </form>
    </div>
  );
}
