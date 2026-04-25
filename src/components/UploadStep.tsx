"use client";

import { NprmDocument } from "@/lib/types";
import { sampleNprms } from "@/data/samples";
import {
  ArrowRight,
  Building2,
  Calendar,
  FileText,
  Landmark,
  AlertCircle,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import DocketSearch from "./DocketSearch";
import ImpactStories from "./ImpactStories";

interface UploadStepProps {
  onSelect: (nprm: NprmDocument) => void;
}

export default function UploadStep({ onSelect }: UploadStepProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showStories, setShowStories] = useState(false);
  const [isProcessingDocket, setIsProcessingDocket] = useState(false);
  const [processingDocketId, setProcessingDocketId] = useState<string | null>(null);

  const handleSearchSelect = async (docket: { id: string }) => {
    setIsProcessingDocket(true);
    setProcessingDocketId(docket.id);

    try {
      const res = await fetch("/api/process-docket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docketId: docket.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to process docket");
      }

      const nprmDoc: NprmDocument = await res.json();
      onSelect(nprmDoc);
    } catch {
      alert("Failed to analyze this docket. Please try a different one or select a pre-loaded NPRM.");
    } finally {
      setIsProcessingDocket(false);
      setProcessingDocketId(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {showStories && <ImpactStories onClose={() => setShowStories(false)} />}

      <div className="text-center">
        <Landmark className="w-16 h-16 text-navy-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-navy-900 mb-2">
          Regulations.gov Public Comment Drafter
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Federal agencies are <strong>legally required</strong> to read and
          respond to substantive public comments under the Administrative
          Procedure Act. Most Americans don&apos;t know they have this power.
          Pick a proposed rule below, tell us your perspective, and we&apos;ll
          draft a legally-formatted comment the agency must address.
        </p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">
              Your Civic Superpower
            </h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              Under the Administrative Procedure Act (5 U.S.C. § 553), agencies
              must publish proposed rules and accept public comments. They must
              address every &ldquo;significant&rdquo; comment in the final rule.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowStories(true)}
          className="bg-navy-50 border border-navy-200 rounded-xl p-5 hover:bg-navy-100 transition-colors flex flex-col items-center justify-center gap-1 flex-shrink-0 min-w-[140px]"
        >
          <BookOpen className="w-5 h-5 text-navy-600" />
          <span className="text-xs font-semibold text-navy-700">Why This Matters</span>
          <span className="text-[10px] text-navy-500">Real stories &rarr;</span>
        </button>
      </div>

      {isProcessingDocket && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Analyzing NPRM from Regulations.gov...
            </p>
            <p className="text-xs text-emerald-600">
              Docket: {processingDocketId} — AI is extracting key sections, proposals, and questions
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-navy-800 mb-4">
          Choose a Proposed Rule to Comment On
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sampleNprms.map((nprm: NprmDocument) => (
            <button
              key={nprm.id}
              onClick={() => onSelect(nprm)}
              disabled={isProcessingDocket}
              onMouseEnter={() => setHoveredId(nprm.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-200
                ${
                  hoveredId === nprm.id
                    ? "border-navy-600 shadow-lg shadow-navy-200/50 -translate-y-0.5"
                    : "border-slate-200 hover:border-slate-300 shadow-sm"
                }
                bg-white group
                disabled:opacity-40 disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy-900 text-sm leading-snug mb-1 line-clamp-2">
                    {nprm.title}
                  </h3>
                  <p className="text-xs text-slate-500">{nprm.agency}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                {nprm.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {nprm.keyTopics.slice(0, 3).map((topic: string) => (
                  <span
                    key={topic}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due {nprm.commentDeadline}
                </span>
                <span className="flex items-center gap-1 text-navy-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Get started <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-3 text-xs text-slate-400 font-medium">
            OR SEARCH ALL ACTIVE DOCKETS
          </span>
        </div>
      </div>

      <DocketSearch onSelect={handleSearchSelect} isProcessing={isProcessingDocket} />

      <div className="text-center">
        <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
          <FileText className="w-4 h-4" />
          Have your own NPRM PDF? Upload it instead — PDF parsing available
          (coming soon)
        </p>
      </div>
    </div>
  );
}
