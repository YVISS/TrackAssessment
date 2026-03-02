"use client";

const RIASEC_DIMENSIONS = [
  { key: "realistic",     label: "Realistic",     abbr: "R", color: "#38bdf8" }, // sky-400
  { key: "investigative", label: "Investigative",  abbr: "I", color: "#4ade80" }, // green-400
  { key: "artistic",      label: "Artistic",       abbr: "A", color: "#c084fc" }, // purple-400
  { key: "social",        label: "Social",         abbr: "S", color: "#f472b6" }, // pink-400
  { key: "enterprising",  label: "Enterprising",   abbr: "E", color: "#fb923c" }, // orange-400
  { key: "conventional",  label: "Conventional",   abbr: "C", color: "#fbbf24" }, // amber-400
];

const MAX_SCORE = 25;
const CENTER = 200;
const RADIUS = 130;
const LEVELS = 5;
const N = RIASEC_DIMENSIONS.length;

function polarToCartesian(index, r) {
  // Start at top (-90°), go clockwise
  const angleDeg = (index / N) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + r * Math.cos(angleRad),
    y: CENTER + r * Math.sin(angleRad),
  };
}

function pointsString(pts) {
  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

function gridPolygon(level) {
  const r = ((level + 1) / LEVELS) * RADIUS;
  return pointsString(RIASEC_DIMENSIONS.map((_, i) => polarToCartesian(i, r)));
}

function dataPolygon(scores) {
  return RIASEC_DIMENSIONS.map((dim, i) => {
    const value = Math.min(Math.max(scores?.[dim.key] ?? 0, 0), MAX_SCORE);
    return polarToCartesian(i, (value / MAX_SCORE) * RADIUS);
  });
}

const RadarIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-sky-400"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
    <path d="M12 12m-11 0a11 11 0 1 0 22 0a11 11 0 1 0 -22 0" />
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
  </svg>
);

/**
 * RiasecRadarChart renders a hexagonal radar (spider) chart of the user's
 * personal RIASEC interest scores across all six dimensions.
 *
 * @param {{ riasecScores: Record<string,number> | null }} props
 */
export default function RiasecRadarChart({ riasecScores }) {
  const hasData =
    riasecScores &&
    typeof riasecScores === "object" &&
    Object.keys(riasecScores).length > 0;

  if (!hasData) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          {RadarIcon}
          <h2 className="text-lg font-bold text-white">RIASEC Interest Profile</h2>
        </div>
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm text-center px-4">
          Complete the assessment to see your full RIASEC interest profile.
        </div>
      </div>
    );
  }

  const dataPoints = dataPolygon(riasecScores);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        {RadarIcon}
        <h2 className="text-lg font-bold text-white">RIASEC Interest Profile</h2>
      </div>

      <div className="w-full flex justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full max-w-xs"
          aria-label="RIASEC Radar Chart"
          role="img"
        >
          {/* Grid polygons */}
          {Array.from({ length: LEVELS }, (_, level) => (
            <polygon
              key={level}
              points={gridPolygon(level)}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
            />
          ))}

          {/* Grid level labels (score values on the first axis) */}
          {Array.from({ length: LEVELS }, (_, level) => {
            const r = ((level + 1) / LEVELS) * RADIUS;
            const pt = polarToCartesian(0, r);
            return (
              <text
                key={`lbl-${level}`}
                x={pt.x + 4}
                y={pt.y}
                fill="#64748b"
                fontSize="9"
                dominantBaseline="middle"
              >
                {((level + 1) / LEVELS) * MAX_SCORE}
              </text>
            );
          })}

          {/* Axis lines */}
          {RIASEC_DIMENSIONS.map((dim, i) => {
            const end = polarToCartesian(i, RADIUS);
            return (
              <line
                key={dim.key}
                x1={CENTER}
                y1={CENTER}
                x2={end.x.toFixed(2)}
                y2={end.y.toFixed(2)}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={pointsString(dataPoints)}
            fill="rgba(96,165,250,0.20)"
            stroke="#60a5fa"
            strokeWidth="2"
          />

          {/* Data point circles with tooltips */}
          {RIASEC_DIMENSIONS.map((dim, i) => (
            <circle
              key={dim.key}
              cx={dataPoints[i].x.toFixed(2)}
              cy={dataPoints[i].y.toFixed(2)}
              r="5"
              fill={dim.color}
              stroke="#1e293b"
              strokeWidth="2"
            >
              <title>{`${dim.label}: ${riasecScores?.[dim.key] ?? 0}`}</title>
            </circle>
          ))}

          {/* Score values near data points */}
          {RIASEC_DIMENSIONS.map((dim, i) => {
            const score = riasecScores?.[dim.key] ?? 0;
            if (score === 0) return null;
            // Offset label slightly away from center
            const angleDeg = (i / N) * 360 - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const offsetX = Math.cos(angleRad) * 14;
            const offsetY = Math.sin(angleRad) * 14;
            return (
              <text
                key={`score-${dim.key}`}
                x={(dataPoints[i].x + offsetX).toFixed(2)}
                y={(dataPoints[i].y + offsetY).toFixed(2)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e2e8f0"
                fontSize="10"
                fontWeight="600"
              >
                {score}
              </text>
            );
          })}

          {/* Axis labels (abbreviated) */}
          {RIASEC_DIMENSIONS.map((dim, i) => {
            const pt = polarToCartesian(i, RADIUS + 22);
            const x = parseFloat(pt.x.toFixed(2));
            const anchor =
              x < CENTER - 5 ? "end" : x > CENTER + 5 ? "start" : "middle";
            return (
              <text
                key={`axis-${dim.key}`}
                x={pt.x.toFixed(2)}
                y={pt.y.toFixed(2)}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill={dim.color}
                fontSize="13"
                fontWeight="700"
              >
                {dim.abbr}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-1">
        {RIASEC_DIMENSIONS.map((dim) => (
          <div key={dim.key} className="flex items-center gap-2 text-xs text-slate-300">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: dim.color }}
            />
            <span>
              <span className="font-semibold">{dim.abbr}</span> – {dim.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
