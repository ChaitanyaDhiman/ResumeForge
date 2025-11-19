import React from 'react';

interface Suggestion {
  type: 'ADD' | 'REVISE' | 'REMOVE';
  section: string;
  targetText?: string;
  suggestedText: string;
  reason: string;
}

interface LLMSuggestions {
  summary: string;
  changes: Suggestion[];
}

interface SuggestionDisplayProps {
  suggestions: LLMSuggestions;
}

export default function SuggestionDisplay({ suggestions }: SuggestionDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Analysis Summary</h3>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{suggestions.summary}</p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 px-2">Recommended Changes</h3>
        {suggestions.changes.map((change, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Card Header */}
            <div className={`px-6 py-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 ${change.type === 'ADD' ? 'bg-emerald-50/50' :
                change.type === 'REVISE' ? 'bg-blue-50/50' : 'bg-rose-50/50'
              }`}>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${change.type === 'ADD' ? 'bg-emerald-100 text-emerald-700' :
                    change.type === 'REVISE' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                  {change.type === 'ADD' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  )}
                  {change.type === 'REVISE' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  )}
                  {change.type === 'REMOVE' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  )}
                  {change.type}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  in <span className="text-gray-900 font-semibold">{change.section}</span>
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 md:p-8 space-y-6">
              {change.targetText && (
                <div className="relative">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    Original Text
                  </h4>
                  <div className="bg-gray-50 p-5 rounded-xl text-gray-600 text-sm leading-relaxed border border-gray-100 font-mono">
                    {change.targetText}
                  </div>
                </div>
              )}

              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${change.type === 'ADD' ? 'text-emerald-600' :
                    change.type === 'REVISE' ? 'text-blue-600' : 'text-rose-600'
                  }`}>
                  Suggested Change
                </h4>
                <div className={`p-5 rounded-xl text-gray-900 text-base font-medium leading-relaxed border ${change.type === 'ADD' ? 'bg-emerald-50/30 border-emerald-100' :
                    change.type === 'REVISE' ? 'bg-blue-50/30 border-blue-100' : 'bg-rose-50/30 border-rose-100'
                  }`}>
                  {change.suggestedText}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="mt-1 min-w-[20px] text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Why this matters</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {change.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}