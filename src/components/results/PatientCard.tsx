import { User, Calendar, Activity } from "lucide-react";
import type { Patient } from "@/types/biomarker";

export function PatientCard({ patient }: { patient: Patient }) {
  const sexLabel = patient.sex === "male" ? "Male" : patient.sex === "female" ? "Female" : "Unknown";

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <User className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Patient</p>
          <p className="font-semibold text-slate-100">{patient.name || "Anonymous"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Profile</p>
          <p className="font-semibold text-slate-100">{sexLabel} · {patient.age} yrs</p>
        </div>
      </div>

      {patient.reportDate && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Report Date</p>
            <p className="font-semibold text-slate-100">{patient.reportDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}
