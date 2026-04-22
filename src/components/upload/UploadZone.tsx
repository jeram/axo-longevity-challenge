"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

type UploadState = "idle" | "dragging" | "uploading" | "error";

export function UploadZone() {
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setState("error");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20MB.");
      setState("error");
      return;
    }

    setFileName(file.name);
    setState("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      sessionStorage.setItem("axo_result", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }, [router]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const isUploading = state === "uploading";

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard className={cn(
        "relative p-8 transition-all duration-300",
        state === "dragging" && "border-teal-500/60 shadow-lg shadow-teal-500/10 scale-[1.02]",
        state === "error" && "border-red-500/40",
        isUploading && "pointer-events-none",
      )}>
        <label
          className={cn("flex flex-col items-center gap-5 cursor-pointer", isUploading && "cursor-not-allowed")}
          onDragOver={(e) => { e.preventDefault(); setState("dragging"); }}
          onDragLeave={() => setState("idle")}
          onDrop={onDrop}
        >
          <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFileInput} disabled={isUploading} />

          {/* Icon */}
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
            isUploading ? "bg-teal-500/20" : "bg-white/5",
            state === "dragging" && "bg-teal-500/20 scale-110",
          )}>
            {isUploading ? (
              <Loader2 className="w-9 h-9 text-teal-400 animate-spin" />
            ) : state === "error" ? (
              <AlertCircle className="w-9 h-9 text-red-400" />
            ) : fileName ? (
              <FileText className="w-9 h-9 text-teal-400" />
            ) : (
              <Upload className="w-9 h-9 text-slate-400 group-hover:text-teal-400 transition-colors" />
            )}
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            {isUploading ? (
              <>
                <p className="font-semibold text-slate-200">Analyzing your report...</p>
                <p className="text-sm text-slate-500">{fileName}</p>
              </>
            ) : state === "error" ? (
              <>
                <p className="font-semibold text-red-400">Upload failed</p>
                <p className="text-sm text-slate-400">{error}</p>
                <p className="text-xs text-slate-500 mt-2">Click to try again</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-200">
                  {state === "dragging" ? "Drop your PDF here" : "Drop your lab report here"}
                </p>
                <p className="text-sm text-slate-500">
                  or <span className="text-teal-400 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-slate-600 mt-1">PDF only · max 20MB</p>
              </>
            )}
          </div>
        </label>

        {/* Progress bar while uploading */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-purple-500 animate-[shimmer_1.5s_ease-in-out_infinite] w-full origin-left" />
          </div>
        )}
      </GlassCard>

      <p className="text-center text-xs text-slate-600 mt-4">
        Your data is processed locally and never stored.
      </p>
    </div>
  );
}
