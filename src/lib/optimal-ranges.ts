interface OptimalRange {
  min?: number;
  max?: number;
  maleMin?: number;
  maleMax?: number;
  femaleMin?: number;
  femaleMax?: number;
}

const OPTIMAL_RANGES: Record<string, OptimalRange> = {
  // CBC
  "Hemoglobin":                  { maleMin: 14,   maleMax: 16,   femaleMin: 13,  femaleMax: 15 },
  "Red Blood Cells":             { maleMin: 4.5,  maleMax: 5.5,  femaleMin: 4.1, femaleMax: 5.1 },
  "Hematocrit":                  { maleMin: 41,   maleMax: 50,   femaleMin: 36,  femaleMax: 46 },
  "MCV":                         { min: 82,   max: 96 },
  "MCH":                         { min: 27,   max: 33 },
  "MCHC":                        { min: 32,   max: 36 },
  "RDW":                         { min: 11.5, max: 13.5 },
  "White Blood Cells":           { min: 4.5,  max: 7.5 },
  "Neutrophils %":               { min: 45,   max: 65 },
  "Lymphocytes %":               { min: 25,   max: 40 },
  "Monocytes %":                 { min: 2,    max: 8 },
  "Eosinophils %":               { min: 0.5,  max: 3 },
  "Basophils %":                 { min: 0,    max: 1 },
  "Platelets":                   { min: 175,  max: 320 },
  "MPV":                         { min: 8,    max: 11 },
  // Metabolic
  "Glucose":                     { min: 75,   max: 90 },
  "HbA1c":                       { max: 5.0 },
  // Lipids
  "Total Cholesterol":           { min: 150,  max: 180 },
  "LDL Cholesterol":             { max: 70 },
  "HDL Cholesterol":             { maleMin: 60, femaleMin: 65 },
  "Non-HDL Cholesterol":         { max: 100 },
  "Triglycerides":               { max: 100 },
  "Lipoprotein(a)":              { max: 14 },
  "Apolipoprotein B":            { max: 80 },
  // Proteins / Inflammation
  "Total Protein":               { min: 68,   max: 78 },
  "Albumin":                     { min: 42,   max: 50 },
  "C-Reactive Protein":         { max: 0.5 },
  // Renal
  "Creatinine":                  { maleMin: 0.8, maleMax: 1.1, femaleMin: 0.6, femaleMax: 0.9 },
  "Uric Acid":                   { maleMin: 3.5, maleMax: 5.5, femaleMin: 3.0, femaleMax: 5.0 },
  "eGFR":                        { min: 90 },
  "BUN":                         { min: 10,   max: 18 },
  // Liver
  "ALT":                         { max: 25 },
  "AST":                         { max: 25 },
  "GGT":                         { maleMax: 30, femaleMax: 20 },
  "Alkaline Phosphatase":        { min: 40,   max: 90 },
  "Total Bilirubin":             { min: 0.2,  max: 0.9 },
  // Thyroid
  "TSH":                         { min: 0.5,  max: 2.5 },
  "Free T4":                     { min: 12,   max: 18 },
  "Free T3":                     { min: 4,    max: 6.5 },
  // Vitamins / Minerals
  "Vitamin D":                   { min: 50,   max: 80 },
  "Vitamin B12":                 { min: 400,  max: 900 },
  "Folate":                      { min: 10,   max: 30 },
  "Ferritin":                    { maleMin: 50, maleMax: 200, femaleMin: 30, femaleMax: 150 },
  "Iron":                        { maleMin: 80, maleMax: 150, femaleMin: 60, femaleMax: 140 },
  "Magnesium":                   { min: 0.85, max: 1.0 },
  "Zinc":                        { min: 80,   max: 120 },
  // Hormones
  "Testosterone (Total)":        { maleMin: 600, maleMax: 900 },
  "Free Testosterone":           { maleMin: 15,  maleMax: 25 },
  "Cortisol (morning)":          { min: 10,   max: 20 },
  "DHEA-S":                      { maleMin: 200, maleMax: 400 },
  "IGF-1":                       { min: 150,  max: 250 },
  "Insulin":                     { max: 5 },
  // Inflammation
  "Homocysteine":                { max: 8 },
  "Fibrinogen":                  { min: 200,  max: 350 },
};

export function getOptimalRange(englishName: string, sex: "male" | "female" | "unknown"): OptimalRange | null {
  const entry = OPTIMAL_RANGES[englishName];
  if (!entry) return null;

  if (sex === "male") {
    return {
      min: entry.maleMin ?? entry.min,
      max: entry.maleMax ?? entry.max,
    };
  }
  if (sex === "female") {
    return {
      min: entry.femaleMin ?? entry.min,
      max: entry.femaleMax ?? entry.max,
    };
  }
  return {
    min: entry.min,
    max: entry.max,
  };
}
