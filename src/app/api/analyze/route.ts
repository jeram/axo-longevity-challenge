import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { extractBiomarkersWithGroq } from "@/lib/groq";
import { classifyBiomarkers } from "@/lib/classifier";
import type { AnalysisResult } from "@/types/biomarker";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 20MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfText = await extractTextFromPDF(buffer);

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json({ error: "Could not extract text from PDF. The file may be image-based." }, { status: 422 });
    }

    const extracted = await extractBiomarkersWithGroq(pdfText);
    const classifiedBiomarkers = classifyBiomarkers(extracted.biomarkers, extracted.patient.sex);

    const result: AnalysisResult = {
      patient: extracted.patient,
      biomarkers: classifiedBiomarkers,
      totalCount: classifiedBiomarkers.length,
      optimalCount: classifiedBiomarkers.filter((b) => b.status === "optimal").length,
      normalCount: classifiedBiomarkers.filter((b) => b.status === "normal").length,
      outOfRangeCount: classifiedBiomarkers.filter((b) => b.status === "out_of_range").length,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[analyze]", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
