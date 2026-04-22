import { cn } from "@/lib/utils";
import type { BiomarkerStatus } from "@/types/biomarker";

const CONFIG: Record<BiomarkerStatus, { label: string; classes: string }> = {
  optimal:      { label: "Optimal",      classes: "bg-teal-500/15 text-teal-400 border border-teal-500/30" },
  normal:       { label: "Normal",       classes: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  out_of_range: { label: "Out of Range", classes: "bg-red-500/15 text-red-400 border border-red-500/30" },
};

export function StatusBadge({ status, className }: { status: BiomarkerStatus; className?: string }) {
  const { label, classes } = CONFIG[status];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap", classes, className)}>
      {label}
    </span>
  );
}
