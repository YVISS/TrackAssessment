"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import RiasecRadarChart from "./RiasecRadarChart";

// Label maps for RIASEC categories and MSA abilities
const RIASEC_LABELS = {
  realistic: "Realistic",
  investigative: "Investigative",
  artistic: "Artistic",
  social: "Social",
  enterprising: "Enterprising",
  conventional: "Conventional",
};

const MSA_LABELS = {
  verbal_ability: "Verbal Ability",
  numerical_ability: "Numerical Ability",
  science_test: "Science Test",
  clerical_ability: "Clerical Ability",
  interpersonal_skills_test: "Interpersonal Skills",
  logical_reasoning: "Logical Reasoning",
  entrepreneurship_test: "Entrepreneurship",
  mechanical_ability: "Mechanical Ability",
};

// Color palettes for the three sections
const TRACK_COLORS = [
  "bg-blue-500",
  "bg-blue-400",
  "bg-blue-300",
];
const RIASEC_COLORS = [
  "bg-purple-500",
  "bg-purple-400",
  "bg-purple-300",
];
const MSA_COLORS = [
  "bg-emerald-500",
  "bg-emerald-400",
  "bg-emerald-300",
];

// Rank badge styles
const RANK_STYLES = [
  "bg-yellow-400 text-yellow-900",
  "bg-slate-300 text-slate-800",
  "bg-amber-600 text-amber-100",
];

const RANK_LABELS = ["1st", "2nd", "3rd"];

/**
 * Returns the top N entries from an object, sorted by value descending.
 * @param {Object} obj - Key/value pairs
 * @param {number} n - Number of top entries to return
 * @returns {Array<[string, number]>}
 */
function getTopN(obj, n = 3) {
  return Object.entries(obj)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n);
}

/**
 * ScoreBar renders a labelled progress bar for a score.
 */
function ScoreBar({ label, score, max = 100, barColor }) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm text-slate-200">
        <span>{label}</span>
        <span className="font-semibold">{typeof score === "number" ? score.toFixed(1) : score}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * TopThreeCard renders a section card (Tracks / RIASEC / MSA) with its top-3 items.
 */
function TopThreeCard({ title, icon, items, labelMap, colors, barMax }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>

      {items.length === 0 ? (
        // Placeholder skeleton when data is unavailable
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4" />
                <div className="h-2 bg-slate-700 rounded animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {items.map(([key, score], idx) => (
            <li key={key} className="flex items-center gap-3">
              {/* Rank badge */}
              <span
                className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-full text-xs font-bold ${RANK_STYLES[idx]}`}
              >
                {RANK_LABELS[idx]}
              </span>

              {/* Label + bar */}
              <div className="flex-1">
                <ScoreBar
                  label={labelMap ? (labelMap[key] ?? key) : key}
                  score={score}
                  max={barMax}
                  barColor={colors[idx]}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/**
 * DashboardContent fetches the authenticated user's latest assessment result
 * from the backend `/student-result/{user_id}` endpoint and renders the three
 * top-3 cards: Tracks, RIASEC, and MSA, along with the RIASEC Radar Chart.
 */
export default function DashboardContent() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topRiasec, setTopRiasec] = useState([]);
  const [topMsa, setTopMsa] = useState([]);
  const [personalRiasecScores, setPersonalRiasecScores] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Get current authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // Fetch user's latest assessment result from backend
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiBase}/student-result/${user.id}`);

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // Extract track scores
        if (data.TVL !== undefined) {
          setTopTracks(
            [
              ["TVL", data.TVL],
              ["STEM", data.STEM],
              ["ABM", data.ABM],
              ["HUMSS", data.HUMSS],
              ["Arts", data.Arts],
              ["Sports", data.Sports],
            ]
              .filter(([, v]) => v !== undefined)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
          );
        }

        // Extract RIASEC scores
        if (data.realistic !== undefined) {
          const riasecScores = {
            realistic: data.realistic,
            investigative: data.investigative,
            artistic: data.artistic,
            social: data.social,
            enterprising: data.enterprising,
            conventional: data.conventional,
          };
          setPersonalRiasecScores(riasecScores);
          setTopRiasec(getTopN(riasecScores, 3));
        }

        // Extract MSA scores
        const msaScores = Object.fromEntries(
          Object.entries({
            verbal_ability: data.verbal_ability,
            numerical_ability: data.numerical_ability,
            science_test: data.science_test,
            clerical_ability: data.clerical_ability,
            interpersonal_skills_test: data.interpersonal_skills_test,
            logical_reasoning: data.logical_reasoning,
            entrepreneurship_test: data.entrepreneurship_test,
            mechanical_ability: data.mechanical_ability,
          }).filter(([, v]) => v !== undefined)
        );
        if (Object.keys(msaScores).length > 0) {
          setTopMsa(getTopN(msaScores, 3));
        }
      } catch (err) {
        setError(err.message ?? "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  // ── Icons ────────────────────────────────────────────────────────────────
  const TrackIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" className="text-blue-400">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 3h6l3 9h-12z" />
      <path d="M12 12v9" />
      <path d="M5 21h14" />
    </svg>
  );

  const RiasecIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" className="text-purple-400">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0 -18" />
      <path d="M12 9v4l2 2" />
    </svg>
  );

  const MsaIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" className="text-emerald-400">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 12l3 -3l3 3l3 -6l3 6l3 -3l3 3" />
    </svg>
  );

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800 rounded-2xl p-6 animate-pulse h-64" />
        ))}
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl p-4">
          <p className="font-semibold">Unable to load dashboard data</p>
          <p className="text-sm mt-1 opacity-80">{error}</p>
          <p className="text-sm mt-2 opacity-60">
            Complete the assessment to see your personalized results, or check
            that the backend service is running.
          </p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="p-6 flex flex-col gap-6">
      <p className="text-slate-400 text-sm">
        Your top-performing areas from the latest assessment results.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top 3 Tracks */}
        <TopThreeCard
          title="Top 3 Tracks"
          icon={TrackIcon}
          items={topTracks}
          labelMap={null}
          colors={TRACK_COLORS}
          barMax={100}
        />

        {/* Top 3 RIASEC Scores */}
        <TopThreeCard
          title="Top 3 RIASEC"
          icon={RiasecIcon}
          items={topRiasec}
          labelMap={RIASEC_LABELS}
          colors={RIASEC_COLORS}
          barMax={25}
        />

        {/* Top 3 MSA Scores */}
        <TopThreeCard
          title="Top 3 MSA Abilities"
          icon={MsaIcon}
          items={topMsa}
          labelMap={MSA_LABELS}
          colors={MSA_COLORS}
          barMax={5}
        />
      </div>

      {/* RIASEC Radar Chart – full 6-dimension interest profile */}
      <RiasecRadarChart riasecScores={personalRiasecScores} />
    </div>
  );
}
