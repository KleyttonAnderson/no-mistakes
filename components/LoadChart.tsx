"use client";

import { useState } from "react";
import { ACCENT, ATIVO_C, CARD, FAINT, MUTED, SUBTLE, TEXT } from "@/lib/colors";
import { fmtDateShort } from "@/lib/format";

const W = 320;
const H = 150;
const PAD_X = 10;
const PAD_TOP = 26;
const PAD_BOTTOM = 24;

export function LoadChart({ points }: { points: { date: string; weight: number }[] }) {
  const [active, setActive] = useState(points.length - 1);

  if (points.length === 0) {
    return (
      <div style={{ padding: "28px 16px", textAlign: "center", color: MUTED, fontSize: 13 }}>
        Nenhuma carga registrada ainda.
      </div>
    );
  }

  const weights = points.map((p) => p.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const span = max - min || 1;

  const coords = points.map((p, i) => {
    const x = points.length === 1 ? W / 2 : PAD_X + (i / (points.length - 1)) * (W - PAD_X * 2);
    const y = PAD_TOP + (1 - (p.weight - min) / span) * (H - PAD_TOP - PAD_BOTTOM);
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${H - PAD_BOTTOM} L${coords[0].x.toFixed(1)},${H - PAD_BOTTOM} Z`;

  const first = points[0].weight;
  const last = points[points.length - 1].weight;
  const delta = last - first;
  const deltaLabel =
    points.length > 1
      ? `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${Math.abs(delta).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg desde o início`
      : "Registre mais uma carga para ver a evolução";
  const deltaColor = delta > 0 ? ATIVO_C : delta < 0 ? "#ff6b4a" : MUTED;

  const activePoint = coords[active] ?? coords[coords.length - 1];
  const bubbleX = Math.min(Math.max(activePoint.x, 32), W - 32);
  const bubbleAbove = activePoint.y > 28;

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, color: deltaColor, marginBottom: 4 }}>{deltaLabel}</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="loadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.32} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>

        <text x={PAD_X} y={14} fontSize="10.5" fontWeight={800} fill={SUBTLE}>
          {max.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg
        </text>
        <text x={PAD_X} y={H - 6} fontSize="10.5" fontWeight={800} fill={FAINT}>
          {min.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg
        </text>

        {points.length > 1 && <path d={areaPath} fill="url(#loadFill)" stroke="none" />}
        {points.length > 1 && (
          <path d={linePath} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}

        {coords.map((c, i) => (
          <g key={i} onClick={() => setActive(i)} style={{ cursor: "pointer" }}>
            <circle cx={c.x} cy={c.y} r={12} fill="transparent" />
            <circle
              cx={c.x}
              cy={c.y}
              r={i === active ? 5.5 : 4}
              fill={i === active ? ACCENT : "#1c1b1a"}
              stroke={ACCENT}
              strokeWidth={2}
            />
          </g>
        ))}

        <g transform={`translate(${bubbleX}, ${bubbleAbove ? activePoint.y - 34 : activePoint.y + 14})`}>
          <rect x={-34} y={0} width={68} height={30} rx={9} fill={CARD} />
          <text x={0} y={12} textAnchor="middle" fontSize="10" fontWeight={700} fill={MUTED}>
            {fmtDateShort(activePoint.date)}
          </text>
          <text x={0} y={24} textAnchor="middle" fontSize="11.5" fontWeight={800} fill={TEXT}>
            {activePoint.weight.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg
          </text>
        </g>
      </svg>
    </div>
  );
}
