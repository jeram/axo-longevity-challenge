import type { RawBiomarker, Biomarker, BiomarkerStatus } from "@/types/biomarker";
import { getOptimalRange } from "./optimal-ranges";

function parseValue(value: number | string): number | null {
  if (typeof value === "number") return value;
  const str = String(value).replace(/[<>]/g, "").trim();
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function classifyStatus(
  biomarker: RawBiomarker,
  sex: "male" | "female" | "unknown"
): BiomarkerStatus {
  const num = parseValue(biomarker.value);
  if (num === null) return "normal";

  const ref = biomarker.referenceRange;

  // Check out of range first
  if (ref.min !== null && num < ref.min) return "out_of_range";
  if (ref.max !== null && num > ref.max) return "out_of_range";

  // Handle "<X" style values (e.g. "<0.2" means below threshold — check if threshold itself is the max)
  if (typeof biomarker.value === "string" && biomarker.value.startsWith("<")) {
    const threshold = parseFloat(biomarker.value.replace("<", "").trim());
    if (!isNaN(threshold) && ref.max !== null && threshold <= ref.max) {
      const optimal = getOptimalRange(biomarker.englishName, sex);
      if (optimal?.max !== undefined && threshold <= (optimal.max ?? Infinity)) return "optimal";
      return "normal";
    }
  }

  // Check optimal range
  const optimal = getOptimalRange(biomarker.englishName, sex);
  if (optimal) {
    const aboveMin = optimal.min === undefined || num >= optimal.min;
    const belowMax = optimal.max === undefined || num <= optimal.max;
    if (aboveMin && belowMax) return "optimal";
  }

  return "normal";
}

export function classifyBiomarkers(
  biomarkers: RawBiomarker[],
  sex: "male" | "female" | "unknown"
): Biomarker[] {
  return biomarkers.map((b) => ({
    ...b,
    status: classifyStatus(b, sex),
  }));
}
