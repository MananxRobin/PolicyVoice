"use client";

import { NprmDocument } from "@/lib/types";
import { buildCommentBody } from "@/lib/regulations";
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  User,
  Globe,
  PartyPopper,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface SubmitStepProps {
  nprm: NprmDocument;
  draft: string;
  onBack: () => void;
  onReset: () => void;
}

export default function SubmitStep({
  nprm,
  draft,
  onBack,
  onReset,
}: SubmitStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formattedComment = buildCommentBody(draft, name, email, org);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docketId: nprm.docketId,
          commentText: draft,
          submitterName: name,
          submitterEmail: email,
          submitterOrg: org,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Submission failed");
      }

      setTrackingNumber(data.trackingNumber || null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit comment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedComment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in max-w-xl mx-auto text-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">
            Comment Submitted!
          </h2>
          <p className="text-slate-600 mb-1">
            Your comment has been submitted to{" "}
            <strong>{nprm.agency}</strong> via Regulations.gov.
          </p>
          {trackingNumber && (
            <p className="text-sm text-slate-500">
              Tracking number:{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded text-navy-700 font-mono">
                {trackingNumber}
              </code>
            </p>
          )}
        </div>

        <div className="bg-navy-50 border border-navy-200 rounded-xl p-5 max-w-md mx-auto">
          <p className="text-sm text-navy-800 leading-relaxed">
            <strong>You just exercised power most Americans don&apos;t know they
            have.</strong> Under the Administrative Procedure Act,{" "}
            {nprm.agency} is legally required to read and respond to
            substantive comments. Your voice now shapes federal policy.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <a
            href={`https://www.regulations.gov/docket/${nprm.docketId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600
              rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-4 h-4" /> View Docket
          </a>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-navy-800 text-white rounded-lg font-medium text-sm
              hover:bg-navy-700 transition-colors"
          >
            Draft Another Comment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Globe className="w-10 h-10 text-navy-600 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-navy-800 mb-1">
          Submit Your Comment
        </h2>
        <p className="text-sm text-slate-500">
          Fill in your details below to submit directly to Regulations.gov.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-navy-800 text-sm">
          Your Information
        </h3>
        <p className="text-xs text-slate-400 -mt-2">
          All fields are public record. Your name and comment will appear on
          Regulations.gov.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm
                  focus:ring-2 focus:ring-navy-400 focus:border-navy-400 outline-none
                  placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm
                  focus:ring-2 focus:ring-navy-400 focus:border-navy-400 outline-none
                  placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Organization (optional)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Community group, business, or individual"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm
                  focus:ring-2 focus:ring-navy-400 focus:border-navy-400 outline-none
                  placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 font-medium">Submission failed</p>
            <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
            <p className="text-xs text-red-500 mt-1">
              You can submit your comment manually at{" "}
              <a
                href={`https://www.regulations.gov/docket/${nprm.docketId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                regulations.gov
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium
            hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy to Clipboard
            </>
          )}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !email.trim() || isSubmitting}
          className="flex-[2] py-3 bg-navy-800 text-white rounded-lg font-medium
            hover:bg-navy-700 transition-colors text-sm flex items-center justify-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Submit to Regulations.gov
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Back to draft
        </button>
        <a
          href={`https://www.regulations.gov/docket/${nprm.docketId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        >
          View docket on Regulations.gov <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
