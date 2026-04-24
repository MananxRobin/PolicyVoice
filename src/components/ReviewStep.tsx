"use client";

import { NprmDocument, NprmSection } from "@/lib/types";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Quote,
} from "lucide-react";
import { useState } from "react";

interface ReviewStepProps {
  nprm: NprmDocument;
  onSelectSection: (section: NprmSection) => void;
}

export default function ReviewStep({ nprm, onSelectSection }: ReviewStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-navy-200 text-xs font-medium mb-1">
              {nprm.agency} · Docket {nprm.docketId}
            </p>
            <h2 className="text-xl font-bold leading-snug">{nprm.title}</h2>
          </div>
          <span className="flex items-center gap-1 text-navy-200 text-xs bg-navy-700/50 px-3 py-1.5 rounded-full flex-shrink-0">
            <Calendar className="w-3 h-3" />
            Comment deadline: {nprm.commentDeadline}
          </span>
        </div>
        <p className="text-navy-200 text-sm leading-relaxed">
          {nprm.summary}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-navy-700" />
          <h3 className="text-lg font-semibold text-navy-800">
            Select a Section to Comment On
          </h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          The NPRM is divided into sections. Each section contains specific
          proposals and questions the agency wants you to address. Choose the
          section that matters most to you.
        </p>

        <div className="space-y-3">
          {nprm.sections.map((section: NprmSection) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <div
                key={section.id}
                className="border border-slate-200 rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left p-4 flex items-start justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 mr-3">
                    <h4 className="font-semibold text-navy-800 text-sm">
                      {section.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {section.pageRef}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 animate-slide-up">
                    <div>
                      <p className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">
                        What the agency is proposing
                      </p>
                      <p className="text-sm text-slate-700 bg-navy-50 rounded-lg p-3">
                        {section.keyProposal}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Agency&apos;s reasoning
                      </p>
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 italic">
                        <Quote className="w-3 h-3 inline mr-1 text-slate-400" />
                        {section.agencyReasoning}
                      </p>
                    </div>

                    {section.questionsAsked.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          Questions the agency wants answered
                        </p>
                        <ul className="space-y-1.5">
                          {section.questionsAsked.map((q, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-700 flex gap-2"
                            >
                              <span className="text-amber-500 font-bold flex-shrink-0">
                                {i + 1}.
                              </span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => onSelectSection(section)}
                      className="w-full py-2.5 bg-navy-800 text-white rounded-lg font-medium text-sm
                        hover:bg-navy-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Draft comment on this section <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
