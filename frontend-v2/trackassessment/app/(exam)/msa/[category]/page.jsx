"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";

export default function MsaPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ stable client
  const supabase = useMemo(() => createClient(), []);

  const BASE_PATH = "/msa";
  const START_CATEGORY = "LR";
  const NEXT_MODULE_START = "/dashboard"; // ✅ msa -> dashboard

  const categoryCode = useMemo(() => {
    const raw = params?.category;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const isLR = categoryCode === "LR";

  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.question_number] !== undefined);

  // ✅ helper: redirect to next unanswered category (or to next module if done)
  const redirectNextUnanswered = (catList, answeredSet) => {
    const nextUnanswered = catList.find((c) => !answeredSet.has(c.id));
    if (nextUnanswered) router.push(`${BASE_PATH}/${nextUnanswered.code}`);
    else router.push(NEXT_MODULE_START);
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      setErrorMsg("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 1) Load categories
      const { data: categories, error: catErr } = await supabase
        .from("msa_categories")
        .select("id, code, name")
        .order("id", { ascending: true });

      if (catErr) {
        console.error(catErr);
        setErrorMsg("Failed to load MSA categories.");
        setLoading(false);
        return;
      }

      const catList = categories || [];
      if (!catList.length) {
        setErrorMsg("No MSA categories configured.");
        setLoading(false);
        return;
      }

      setAllCategories(catList);

      // 2) Resolve current by code
      const current = catList.find((c) => c.code === categoryCode);
      if (!current) {
        router.push(`${BASE_PATH}/${START_CATEGORY}`);
        return;
      }

      // 3) Validation: already answered category -> next unanswered
      const { data: answeredRows, error: ansErr } = await supabase
        .from("msa_answers")
        .select("category_id")
        .eq("user_id", user.id)
        .in("category_id", catList.map((c) => c.id));

      if (ansErr) {
        console.error(ansErr);
        setErrorMsg("Failed to validate MSA progress.");
        setLoading(false);
        return;
      }

      const answeredSet = new Set((answeredRows || []).map((r) => r.category_id));

      if (answeredSet.has(current.id)) {
        redirectNextUnanswered(catList, answeredSet);
        return;
      }

      setCategory(current);

      // 4) Fetch PART questions for the category
      const { data: qs, error: qErr } = await supabase
        .from("msa_questions")
        .select("question_number, questions, opt_a, opt_b, opt_c, opt_d, opt_e, image_url")
        .eq("category_id", current.id)
        .order("question_number", { ascending: true });

      if (qErr) {
        console.error(qErr);
        setErrorMsg("Failed to load MSA questions.");
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

  const goToNextCategory = () => {
    const index = allCategories.findIndex((c) => c.id === category?.id);
    const next = allCategories[index + 1];

    if (next) router.push(`${BASE_PATH}/${next.code}`);
    else router.push(NEXT_MODULE_START); // ✅ end msa -> dashboard
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
      const payload = Object.entries(answers).map(([qnum, ans]) => ({
        user_id: user.id,
        category_id: category.id,
        question_number: Number(qnum),
        answer: ans, // A/B/C/D/E
      }));

      // ✅ upsert for retakes
      const { error } = await supabase
        .from("msa_answers")
        .upsert(payload, { onConflict: "user_id,category_id,question_number" });

      if (error) throw error;

      goToNextCategory();
    } catch (err) {
      console.error(err);
      setErrorMsg("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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

  const getOptionImageUrl = (questionImageUrl, letter) => {
    if (!questionImageUrl) return null;
    const idx = questionImageUrl.lastIndexOf("LR-Question.webp");
    if (idx === -1) return null;
    return questionImageUrl.slice(0, idx) + `LR-OPT-${letter}.webp`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q) => (
          <div key={q.question_number} className="bg-stone-600/10 p-6 rounded-xl">
            <h3 className="font-semibold mb-4">
              {q.question_number}. {q.questions}
            </h3>

            {q.image_url && (
              <div className="mb-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={q.image_url}
                  alt={`Question ${q.question_number}`}
                  className="max-w-full rounded-lg"
                />
              </div>
            )}

            <div className={isLR ? "grid grid-cols-2 md:grid-cols-5 gap-2" : "space-y-3"}>
              {[
                { key: "A", text: q.opt_a },
                { key: "B", text: q.opt_b },
                { key: "C", text: q.opt_c },
                { key: "D", text: q.opt_d },
                { key: "E", text: q.opt_e },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`flex duration-300 ease-in-out items-center gap-3 p-3 rounded-lg hover:bg-stone-500/10 cursor-pointer ${
                    isLR ? "flex-col" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.question_number}`}
                    value={opt.key}
                    checked={answers[q.question_number] === opt.key}
                    onChange={() => handleAnswerChange(q.question_number, opt.key)}
                  />
                  {isLR ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getOptionImageUrl(q.image_url, opt.key)}
                        alt={`Option ${opt.key}`}
                        className="max-w-full rounded"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <span className="font-semibold">{opt.key}</span>
                    </>
                  ) : (
                    <span>
                      <strong>{opt.key}.</strong> {opt.text}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={!allAnswered || submitting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-semibold py-3 px-8 rounded-lg"
          >
            {submitting ? "Submitting..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}