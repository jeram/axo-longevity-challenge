"use client";

import { useEffect, useState } from "react";
import { Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Props {
  total: number;
  optimal: number;
  normal: number;
  outOfRange: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{display}</span>;
}

const STATS = [
  {
    key: "total" as const,
    label: "Total Biomarkers",
    icon: Zap,
    iconClass: "text-slate-400",
    bgClass: "bg-slate-700/40",
    valueClass: "text-slate-100",
  },
  {
    key: "optimal" as const,
    label: "Optimal",
    icon: CheckCircle,
    iconClass: "text-teal-400",
    bgClass: "bg-teal-500/15",
    valueClass: "text-teal-400",
  },
  {
    key: "normal" as const,
    label: "Normal",
    icon: AlertTriangle,
    iconClass: "text-amber-400",
    bgClass: "bg-amber-500/15",
    valueClass: "text-amber-400",
  },
  {
    key: "outOfRange" as const,
    label: "Out of Range",
    icon: XCircle,
    iconClass: "text-red-400",
    bgClass: "bg-red-500/15",
    valueClass: "text-red-400",
  },
];

export function SummaryStats({ total, optimal, normal, outOfRange }: Props) {
  const values = { total, optimal, normal, outOfRange };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(({ key, label, icon: Icon, iconClass, bgClass, valueClass }) => (
        <GlassCard key={key} className="p-5">
          <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${iconClass}`} />
          </div>
          <p className={`text-2xl font-bold font-mono ${valueClass}`}>
            <AnimatedNumber value={values[key]} />
          </p>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
        </GlassCard>
      ))}
    </div>
  );
}
