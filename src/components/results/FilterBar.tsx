"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BiomarkerStatus } from "@/types/biomarker";

type FilterStatus = BiomarkerStatus | "all";

const FILTERS: { value: FilterStatus; label: string; activeClass: string }[] = [
  { value: "all",          label: "All",          activeClass: "bg-slate-600 text-slate-100 border-slate-500" },
  { value: "optimal",      label: "Optimal",      activeClass: "bg-teal-500/20 text-teal-300 border-teal-500/50" },
  { value: "normal",       label: "Normal",       activeClass: "bg-amber-500/20 text-amber-300 border-amber-500/50" },
  { value: "out_of_range", label: "Out of Range", activeClass: "bg-red-500/20 text-red-300 border-red-500/50" },
];

interface Props {
  activeFilter: FilterStatus;
  searchQuery: string;
  onFilterChange: (f: FilterStatus) => void;
  onSearchChange: (s: string) => void;
}

export function FilterBar({ activeFilter, searchQuery, onFilterChange, onSearchChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ value, label, activeClass }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200",
              activeFilter === value
                ? activeClass
                : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search biomarkers..."
          className="w-full pl-9 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
          </button>
        )}
      </div>
    </div>
  );
}
