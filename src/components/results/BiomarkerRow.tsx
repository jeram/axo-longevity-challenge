import { StatusBadge } from "@/components/ui/StatusBadge";
import { RangeBar } from "./RangeBar";
import type { Biomarker } from "@/types/biomarker";

export function BiomarkerRow({ biomarker }: { biomarker: Biomarker }) {
  const { englishName, originalName, value, unit, referenceRange, status } = biomarker;
  const showOriginal = originalName.toLowerCase() !== englishName.toLowerCase();

  return (
    <tr className="group border-t border-white/5 hover:bg-white/3 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-slate-200">{englishName}</p>
        {showOriginal && (
          <p className="text-xs text-slate-600 mt-0.5">{originalName}</p>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <span className="font-mono text-sm font-semibold text-slate-100">{value}</span>
        <span className="text-xs text-slate-500 ml-1">{unit}</span>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <RangeBar biomarker={biomarker} />
      </td>
      <td className="py-3 px-4 hidden sm:table-cell text-xs text-slate-500 font-mono whitespace-nowrap">
        {referenceRange.display}
      </td>
      <td className="py-3 px-4 text-right">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}
