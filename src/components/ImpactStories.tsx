"use client";

import { ImpactStory, impactStories } from "@/data/impact-stories";
import { ExternalLink, Quote, Users, TrendingUp, X } from "lucide-react";

interface ImpactStoriesProps {
  onClose: () => void;
}

export default function ImpactStories({ onClose }: ImpactStoriesProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-navy-900">Why Public Comments Matter</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Real stories of citizens who shaped federal policy
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
            <p className="text-sm text-navy-800 leading-relaxed">
              Under the Administrative Procedure Act (5 U.S.C. § 553), federal agencies must publish proposed rules, accept public comments, and <strong>address every significant comment</strong> in the final rule. The stories below are not hypothetical — they happened. Comments from ordinary people changed federal law.
            </p>
          </div>

          {impactStories.map((story) => (
            <div
              key={story.id}
              className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {story.agency} • {story.year}
                    </p>
                    <h3 className="font-semibold text-navy-800 text-sm mt-1 leading-snug">
                      {story.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 bg-navy-50 text-navy-700 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                    <Users className="w-3 h-3" />
                    {story.commentCount}
                  </div>
                </div>

                <p className="text-sm font-medium text-navy-700 italic">
                  {story.headline}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {story.summary}
                </p>

                <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg p-3">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Outcome
                  </p>
                  <p className="text-sm text-emerald-900">{story.outcome}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <Quote className="w-4 h-4 text-slate-300 mb-1" />
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    — {story.quoteAttribution}
                  </p>
                </div>

                <a
                  href={story.docketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-navy-600 hover:text-navy-800 font-medium transition-colors"
                >
                  View actual docket on Regulations.gov
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 text-center">
            <p className="text-emerald-800 font-semibold text-sm mb-1">
              Your comment has the same legal weight as a K Street lobbyist&apos;s.
            </p>
            <p className="text-emerald-700 text-xs">
              The only difference? They&apos;re paid to write them. Now you have the tool to match them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
