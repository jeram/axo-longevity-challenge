export type BiomarkerStatus = "optimal" | "normal" | "out_of_range";

export interface ReferenceRange {
  min: number | null;
  max: number | null;
  display: string;
}

export interface Biomarker {
  originalName: string;
  englishName: string;
  value: number | string;
  unit: string;
  referenceRange: ReferenceRange;
  category: string;
  status: BiomarkerStatus;
  note?: string;
}

export interface Patient {
  name: string;
  sex: "male" | "female" | "unknown";
  dateOfBirth: string;
  age: number;
  reportDate: string;
}

export interface AnalysisResult {
  patient: Patient;
  biomarkers: Biomarker[];
  totalCount: number;
  optimalCount: number;
  normalCount: number;
  outOfRangeCount: number;
}

export interface RawBiomarker {
  originalName: string;
  englishName: string;
  value: number | string;
  unit: string;
  referenceRange: ReferenceRange;
  category: string;
}

export interface GeminiResponse {
  patient: Patient;
  biomarkers: RawBiomarker[];
}
