"use client";

import { Search, Loader2, ExternalLink, Calendar, Building2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface DocketResult {
  id: string;
  title: string;
  agency: string;
  docketType: string;
  postedDate: string;
  commentEndDate: string | null;
  commentsReceived: number;
}

interface DocketSearchProps {
  onSelect: (docket: DocketResult) => void;
  isProcessing: boolean;
}

export default function DocketSearch({ onSelect, isProcessing }: DocketSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocketResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search-dockets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || "Search failed");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search Active Regulations.gov Dockets
        </h3>
        <p className="text-xs text-emerald-700 mb-3">
          Find any active rulemaking by keyword — environment, healthcare, technology, housing, and more.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Try "PFAS", "broadband", "telehealth"...'
            className="flex-1 px-3 py-2 border border-emerald-200 rounded-lg text-sm
              focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none
              placeholder:text-slate-300 bg-white"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || isProcessing || query.trim().length < 2}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm
              hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center gap-1.5 flex-shrink-0"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{error}</p>
        </div>
      )}

      {isSearching && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mr-2" />
          <span className="text-sm text-slate-500">Searching regulations.gov...</span>
        </div>
      )}

      {hasSearched && !isSearching && results.length === 0 && !error && (
        <div className="text-center py-6 text-slate-400 text-sm">
          No active rulemakings found for &ldquo;{query}&rdquo;. Try a broader term.
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            Found {results.length} active docket{results.length !== 1 ? "s" : ""}:
          </p>
          {results.map((docket) => (
            <button
              key={docket.id}
              onClick={() => onSelect(docket)}
              disabled={isProcessing}
              className="w-full text-left p-4 bg-white border border-slate-200 rounded-lg
                hover:border-emerald-400 hover:shadow-sm transition-all
                disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                    {docket.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {docket.agency}
                    </span>
                    {docket.commentEndDate && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {docket.commentEndDate}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {docket.commentsReceived.toLocaleString()} comments
                    </span>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1 flex-shrink-0">
                  Analyze <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
