"use client";

import type { Biomarker } from "@/types/biomarker";

interface Props {
  biomarker: Biomarker;
}

const STATUS_COLOR: Record<string, string> = {
  optimal:      "#00D4AA",
  normal:       "#F59E0B",
  out_of_range: "#EF4444",
};

export function RangeBar({ biomarker }: Props) {
  const { value, referenceRange, status } = biomarker;
  const numValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[<>]/g, "").trim());

  if (isNaN(numValue) || referenceRange.min === null || referenceRange.max === null) {
    return <div className="text-xs text-slate-600 italic">—</div>;
  }

  const ref = { min: referenceRange.min, max: referenceRange.max };
  const spread = ref.max - ref.min;
  const padding = spread * 0.25;
  const barMin = Math.min(numValue, ref.min) - padding;
  const barMax = Math.max(numValue, ref.max) + padding;
  const barRange = barMax - barMin;

  const toPercent = (v: number) => Math.min(100, Math.max(0, ((v - barMin) / barRange) * 100));

  const refLeft = toPercent(ref.min);
  const refWidth = toPercent(ref.max) - refLeft;
  const dotPos = toPercent(numValue);
  const color = STATUS_COLOR[status];

  return (
    <div className="w-full max-w-[160px]">
      <div className="relative h-1.5 rounded-full bg-white/7 my-1">
        {/* Reference range zone */}
        <div
          className="absolute h-full rounded-full bg-white/10"
          style={{ left: `${refLeft}%`, width: `${refWidth}%` }}
        />
        {/* Value dot */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full -translate-y-[3px] -translate-x-1/2 shadow-lg"
          style={{ left: `${dotPos}%`, background: color, boxShadow: `0 0 6px ${color}80` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
        <span>{ref.min}</span>
        <span>{ref.max}</span>
      </div>
    </div>
  );
}
