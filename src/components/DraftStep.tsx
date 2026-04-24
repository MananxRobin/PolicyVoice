"use client";

import { NprmDocument, NprmSection, UserAnswer } from "@/lib/types";
import {
  Copy,
  Download,
  Loader2,
  Pencil,
  Check,
  ExternalLink,
  Quote,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface DraftStepProps {
  nprm: NprmDocument;
  section: NprmSection;
  answers: UserAnswer[];
  onProceed: (draft: string) => void;
  onBack: () => void;
}

export default function DraftStep({
  nprm,
  section,
  answers,
  onProceed,
  onBack,
}: DraftStepProps) {
  const [draftBody, setDraftBody] = useState<string>("");
  const [citations, setCitations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateDraft();
  }, []);

  const generateDraft = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/draft-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nprmId: nprm.id,
          sectionId: section.id,
          answers,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate draft");
      const data = await res.json();
      setDraftBody(data.body);
      setCitations(data.citations || []);
      setEditedBody(data.body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate draft");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = [
      `PUBLIC COMMENT\n`,
      `Docket ID: ${nprm.docketId}\n`,
      `Agency: ${nprm.agency}\n`,
      `Subject: ${nprm.title}\n`,
      `Section: ${section.title}\n`,
      `Date: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}\n`,
      `---\n\n`,
      editedBody,
      `\n\n---\n`,
      `Submit this comment at: https://www.regulations.gov/docket/${nprm.docketId}\n`,
    ].join("");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comment-${nprm.docketId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-navy-600 animate-spin mb-4" />
        <p className="text-slate-600 text-sm">
          Drafting your public comment...
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Analyzing {nprm.agency} regulations and your responses
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="text-slate-600 underline text-sm"
          >
            Go back
          </button>
          <button
            onClick={generateDraft}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Quote className="w-10 h-10 text-navy-600 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-navy-800 mb-1">
          Your Draft Comment is Ready
        </h2>
        <p className="text-sm text-slate-500">
          Review, edit if needed, then proceed to submit to{" "}
          {nprm.agency} via Regulations.gov.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-2">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">
          Docket Information
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-slate-400">Docket ID:</span>{" "}
            <span className="font-mono text-slate-700">{nprm.docketId}</span>
          </div>
          <div>
            <span className="text-slate-400">Agency:</span>{" "}
            <span className="text-slate-700">{nprm.agency}</span>
          </div>
          <div>
            <span className="text-slate-400">Section:</span>{" "}
            <span className="text-slate-700">{section.title}</span>
          </div>
          <div>
            <span className="text-slate-400">Page Ref:</span>{" "}
            <span className="text-slate-700">{section.pageRef}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-navy-50 border-b border-navy-100 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-navy-700 uppercase tracking-wide">
            Comment Draft
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) setDraftBody(editedBody);
                else setEditedBody(draftBody);
              }}
              className="p-1.5 text-slate-400 hover:text-navy-600 transition-colors rounded"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-navy-600 transition-colors rounded"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-slate-400 hover:text-navy-600 transition-colors rounded"
              title="Download as text file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {isEditing ? (
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={18}
              className="w-full text-sm text-slate-700 leading-relaxed border-0 outline-none resize-none
                focus:ring-2 focus:ring-navy-200 rounded-lg p-2"
            />
          ) : (
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
              <ReactMarkdown>{draftBody}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {citations.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
            Citations & References
          </p>
          <ul className="space-y-1">
            {citations.map((cite: string, i: number) => (
              <li
                key={i}
                className="text-sm text-amber-800 flex items-start gap-2"
              >
                <span className="text-amber-400 mt-0.5">&#8226;</span>
                {cite}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium
            hover:bg-slate-50 transition-colors text-sm"
        >
          Back to Interview
        </button>
        <button
          onClick={() =>
            onProceed(isEditing ? editedBody : draftBody)
          }
          className="flex-[2] py-3 bg-navy-800 text-white rounded-lg font-medium
            hover:bg-navy-700 transition-colors text-sm flex items-center justify-center gap-2"
        >
          Submit to Regulations.gov
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
