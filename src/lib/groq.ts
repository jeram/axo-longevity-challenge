import Groq from "groq-sdk";
import type { GeminiResponse } from "@/types/biomarker";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a medical data extraction expert. Extract all biomarker data from lab report text.
Return ONLY valid JSON — no markdown, no explanation, just the JSON object.`;

const buildUserPrompt = (text: string) => `
Extract ALL biomarkers from this lab report. The report may be in Spanish or another language — translate everything to English.

Return this exact JSON structure:
{
  "patient": {
    "name": string or "Anonymous",
    "sex": "male" | "female" | "unknown",
    "dateOfBirth": "YYYY-MM-DD" or "",
    "age": number,
    "reportDate": "YYYY-MM-DD" or ""
  },
  "biomarkers": [
    {
      "originalName": "name as it appears in the report",
      "englishName": "standardized English name",
      "value": number or string (e.g. "<0.2", "Positive"),
      "unit": "standardized unit in English",
      "referenceRange": {
        "min": number or null,
        "max": number or null,
        "display": "original range string e.g. 4.1 - 5.75 or < 5.7"
      },
      "category": one of: "CBC" | "Metabolic" | "Lipids" | "Proteins" | "Renal" | "Liver" | "Thyroid" | "Hormones" | "Vitamins & Minerals" | "Inflammation" | "Other"
    }
  ]
}

Rules:
- Translate Spanish biomarker names to standard English medical names
- Standardize units (e.g. "x10³/mm³" → "×10³/μL", "g/dL" stays "g/dL")
- If a value is flagged with * or H/L in the report, still include it
- Skip non-biomarker entries (blood type, Rh factor, narrative text)
- For sex: "HOMBRE" = male, "MUJER" = female
- Calculate age from date of birth and report date if needed

Lab report text:
${text}
`;

export async function extractBiomarkersWithGroq(pdfText: string): Promise<GeminiResponse> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(pdfText) },
    ],
    temperature: 0.1,
    max_tokens: 4096,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  // Strip any accidental markdown code fences
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

  try {
    return JSON.parse(cleaned) as GeminiResponse;
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${cleaned.slice(0, 200)}`);
  }
}
