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
  TrendingUp,
  Target,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ScoreResult {
  overallScore: number;
  specificity: number;
  evidence: number;
  relevance: number;
  persuasiveness: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  apaSignificance: "high" | "medium" | "low";
}

interface DraftStepProps {
  nprm: NprmDocument;
  section: NprmSection;
  answers: UserAnswer[];
  onProceed: (draft: string) => void;
  onBack: () => void;
}

function scoreColor(score: number): string {
  if (score >= 7.5) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-red-500";
}

function scoreBg(score: number): string {
  if (score >= 7.5) return "bg-emerald-50 border-emerald-200";
  if (score >= 5) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function scoreLabel(score: number): string {
  if (score >= 8) return "Highly Effective";
  if (score >= 6) return "Moderately Effective";
  if (score >= 4) return "Needs Improvement";
  return "Weak — Revise";
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
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  useEffect(() => {
    generateDraft();
  }, []);

  const generateDraft = async () => {
    setIsGenerating(true);
    setError(null);
    setScoreResult(null);
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

  const handleScoreComment = async () => {
    const commentToScore = isEditing ? editedBody : draftBody;
    setIsScoring(true);
    setScoreError(null);

    try {
      const res = await fetch("/api/score-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentToScore,
          sectionQuestions: section.questionsAsked,
          agencyName: nprm.agency,
        }),
      });

      if (!res.ok) throw new Error("Failed to score comment");
      const data: ScoreResult = await res.json();
      setScoreResult(data);
    } catch (err) {
      setScoreError(err instanceof Error ? err.message : "Failed to score");
    } finally {
      setIsScoring(false);
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

      {/* EFFECTIVENESS SCORE */}
      <div className="space-y-3">
        <button
          onClick={handleScoreComment}
          disabled={isScoring}
          className="w-full py-3 border-2 border-dashed rounded-lg font-medium text-sm
            flex items-center justify-center gap-2 transition-all
            border-slate-300 text-slate-500 hover:border-navy-400 hover:text-navy-700 hover:bg-navy-50
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScoring ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing effectiveness...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              {scoreResult ? "Re-Score My Comment" : "Score My Comment — How Effective Is It?"}
            </>
          )}
        </button>

        {scoreError && (
          <p className="text-xs text-red-500 text-center">{scoreError}</p>
        )}

        {scoreResult && (
          <div className={`border rounded-xl p-5 ${scoreBg(scoreResult.overallScore)} animate-slide-up`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Comment Effectiveness Score
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Based on APA significance criteria — how likely {nprm.agency} is to address this comment
                </p>
              </div>
              <div className="text-center">
                <span className={`text-3xl font-bold ${scoreColor(scoreResult.overallScore)}`}>
                  {scoreResult.overallScore}
                </span>
                <span className="text-slate-400 text-sm">/10</span>
                <p className={`text-xs font-semibold ${scoreColor(scoreResult.overallScore)} mt-0.5`}>
                  {scoreLabel(scoreResult.overallScore)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "Specificity", value: scoreResult.specificity, icon: Target },
                { label: "Evidence", value: scoreResult.evidence, icon: ShieldCheck },
                { label: "Relevance", value: scoreResult.relevance, icon: Target },
                { label: "Persuasion", value: scoreResult.persuasiveness, icon: TrendingUp },
              ].map((metric) => (
                <div key={metric.label} className="text-center bg-white/60 rounded-lg p-2">
                  <metric.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${scoreColor(metric.value)}`} />
                  <p className={`text-lg font-bold ${scoreColor(metric.value)}`}>
                    {metric.value}
                  </p>
                  <p className="text-[10px] text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {scoreResult.strengths.length > 0 && (
                <div className="bg-emerald-100/50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Strengths
                  </p>
                  <ul className="space-y-1">
                    {scoreResult.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-emerald-700 flex gap-1.5">
                        <span className="text-emerald-400">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scoreResult.weaknesses.length > 0 && (
                <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Weaknesses
                  </p>
                  <ul className="space-y-1">
                    {scoreResult.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="text-xs text-amber-700 flex gap-1.5">
                        <span className="text-amber-400">-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scoreResult.improvements.length > 0 && (
                <div className="bg-navy-50 border border-navy-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-navy-800 mb-1.5 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> How to Improve
                  </p>
                  <ul className="space-y-1.5">
                    {scoreResult.improvements.map((imp: string, i: number) => (
                      <li key={i} className="text-xs text-navy-700 flex gap-1.5">
                        <span className="text-navy-400 font-bold">{i + 1}.</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500">APA Significance:</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    scoreResult.apaSignificance === "high"
                      ? "bg-emerald-100 text-emerald-700"
                      : scoreResult.apaSignificance === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {scoreResult.apaSignificance.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400">
                  {scoreResult.apaSignificance === "high"
                    ? "— Agency is legally required to address this"
                    : scoreResult.apaSignificance === "medium"
                    ? "— Agency likely to consider this"
                    : "— May not trigger APA response requirement"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

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
