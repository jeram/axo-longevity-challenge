"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BiomarkerRow } from "./BiomarkerRow";
import type { Biomarker } from "@/types/biomarker";

const CATEGORY_ICONS: Record<string, string> = {
  "CBC":                  "🩸",
  "Metabolic":            "⚡",
  "Lipids":               "💧",
  "Proteins":             "🔬",
  "Renal":                "🫘",
  "Liver":                "🧬",
  "Thyroid":              "🦋",
  "Hormones":             "⚗️",
  "Vitamins & Minerals":  "✨",
  "Inflammation":         "🔥",
  "Other":                "📊",
};

interface Props {
  category: string;
  biomarkers: Biomarker[];
}

export function CategorySection({ category, biomarkers }: Props) {
  const [open, setOpen] = useState(true);

  const outOfRange = biomarkers.filter((b) => b.status === "out_of_range").length;
  const optimal = biomarkers.filter((b) => b.status === "optimal").length;
  const icon = CATEGORY_ICONS[category] ?? "📊";

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-slate-200">{category}</span>
          <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{biomarkers.length}</span>
          {outOfRange > 0 && (
            <span className="text-xs text-red-400 bg-red-500/15 border border-red-500/25 px-2 py-0.5 rounded-full">
              {outOfRange} out of range
            </span>
          )}
          {outOfRange === 0 && optimal === biomarkers.length && (
            <span className="text-xs text-teal-400 bg-teal-500/15 border border-teal-500/25 px-2 py-0.5 rounded-full">
              All optimal
            </span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Table */}
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-white/5">
                <th className="text-left py-2 px-4 text-xs text-slate-600 uppercase tracking-wider font-medium">Biomarker</th>
                <th className="text-right py-2 px-4 text-xs text-slate-600 uppercase tracking-wider font-medium">Value</th>
                <th className="py-2 px-4 text-xs text-slate-600 uppercase tracking-wider font-medium hidden md:table-cell">Range</th>
                <th className="py-2 px-4 text-xs text-slate-600 uppercase tracking-wider font-medium hidden sm:table-cell">Reference</th>
                <th className="text-right py-2 px-4 text-xs text-slate-600 uppercase tracking-wider font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {biomarkers.map((b, i) => (
                <BiomarkerRow key={i} biomarker={b} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
