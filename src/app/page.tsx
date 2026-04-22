import { UploadZone } from "@/components/upload/UploadZone";
import { Activity, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-teal-500/8 blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-40 -right-40 w-150 h-150 rounded-full bg-purple-600/8 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full bg-teal-400/4 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-400 to-purple-500 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-linear-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
            Axo Longevity
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <Shield className="w-3 h-3 text-teal-500" />
          GDPR Compliant
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <Zap className="w-3 h-3" />
          AI-Powered Biomarker Analysis
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-3xl">
          <span className="text-slate-100">Understand</span>
          <br />
          <span className="bg-linear-to-r from-teal-400 via-teal-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
            Your Biology
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mb-12 leading-relaxed">
          Upload any lab report. Our AI instantly extracts, translates, and classifies
          every biomarker — telling you what&apos;s <span className="text-teal-400">optimal</span>,
          what&apos;s normal, and what needs attention.
        </p>

        {/* Upload zone */}
        <UploadZone />

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
          {[
            "100+ biomarkers",
            "Any language",
            "Age & sex adjusted",
            "Optimal ranges",
            "Instant results",
          ].map((f) => (
            <span key={f} className="text-xs text-slate-500 bg-white/4 border border-white/8 px-3 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-slate-700">
        Built for Axo Longevity · For informational purposes only · Not medical advice
      </footer>
    </div>
  );
}
