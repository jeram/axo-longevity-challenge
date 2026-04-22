"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, Upload } from "lucide-react";
import { SummaryStats } from "@/components/results/SummaryStats";
import { PatientCard } from "@/components/results/PatientCard";
import { FilterBar } from "@/components/results/FilterBar";
import { CategorySection } from "@/components/results/CategorySection";
import type { AnalysisResult, Biomarker, BiomarkerStatus } from "@/types/biomarker";

type FilterStatus = BiomarkerStatus | "all";

const CATEGORY_ORDER = [
  "CBC", "Metabolic", "Lipids", "Proteins", "Renal",
  "Liver", "Thyroid", "Hormones", "Vitamins & Minerals", "Inflammation", "Other",
];

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("axo_result");
    if (!raw) { router.replace("/"); return; }
    try { setResult(JSON.parse(raw)); } catch { router.replace("/"); }
  }, [router]);

  if (!result) return null;

  // Group + filter biomarkers
  const filtered = result.biomarkers.filter((b: Biomarker) => {
    const matchesFilter = filter === "all" || b.status === filter;
    const matchesSearch = search.trim() === "" ||
      b.englishName.toLowerCase().includes(search.toLowerCase()) ||
      b.originalName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const byCategory = CATEGORY_ORDER.reduce<Record<string, Biomarker[]>>((acc, cat) => {
    const items = filtered.filter((b) => b.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Catch any categories not in the ordered list
  filtered.forEach((b) => {
    if (!byCategory[b.category]) byCategory[b.category] = [];
    if (!byCategory[b.category].includes(b)) byCategory[b.category].push(b);
  });

  const categories = Object.keys(byCategory);

  return (
    <div className="relative min-h-screen">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 w-150 h-150 rounded-full bg-teal-500/5 blur-[140px]" />
        <div className="absolute -bottom-60 -right-60 w-150 h-150 rounded-full bg-purple-600/5 blur-[140px]" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-20 glass border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-teal-400 to-purple-500 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight bg-linear-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                Axo Longevity
              </span>
            </div>
          </div>

          <PatientCard patient={result.patient} />

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            New Report
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Summary stats */}
        <SummaryStats
          total={result.totalCount}
          optimal={result.optimalCount}
          normal={result.normalCount}
          outOfRange={result.outOfRangeCount}
        />

        {/* Filter bar */}
        <FilterBar
          activeFilter={filter}
          searchQuery={search}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
        />

        {/* Results */}
        {categories.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-500">No biomarkers match your filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <CategorySection key={cat} category={cat} biomarkers={byCategory[cat]} />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-slate-700 pb-4">
          For informational purposes only · Not medical advice · Always consult a healthcare professional
        </p>
      </main>
    </div>
  );
}
