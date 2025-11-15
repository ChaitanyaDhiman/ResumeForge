'use client';

import React from 'react';

export interface Suggestion {
  type: 'ADD' | 'REVISE' | 'REMOVE';
  section: string;
  targetText?: string;
  suggestedText: string;
  reason: string;
}

export interface LLMSuggestions {
  summary: string;
  changes: Suggestion[];
}

interface SuggestionDisplayProps {
  suggestions: LLMSuggestions;
}

const TYPE_MAP = {
  ADD: { color: 'text-green-600 border-green-300 bg-green-50', label: 'ADD', icon: '✨' },
  REVISE: { color: 'text-blue-600 border-blue-300 bg-blue-50', label: 'REVISE', icon: '✍️' },
  REMOVE: { color: 'text-red-600 border-red-300 bg-red-50', label: 'REMOVE', icon: '🗑️' },
};

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({ suggestions }) => {
  if (!suggestions || !suggestions.changes || suggestions.changes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-xl">
        No actionable suggestions found. Your resume may already be a good match!
      </div>
    );
  }

  const groupedChanges = suggestions.changes.reduce((acc, change) => {
    const section = change.section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(change);
    return acc;
  }, {} as Record<string, Suggestion[]>);

  return (
    <div className="space-y-8">
      
      {/* Summary Section */}
      <div className="p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-indigo-800 mb-2">🎯 Overall Analysis Summary</h3>
        <p className="text-indigo-700 whitespace-pre-wrap">{suggestions.summary}</p>
      </div>

      {/* Detailed Suggestions Section */}
      <h2 className="text-2xl font-bold text-gray-800">Detailed Action Items ({suggestions.changes.length})</h2>
      
      {Object.entries(groupedChanges).map(([section, changes]) => (
        <div key={section} className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
            📂 {section} Section
          </h3>
          
          <div className="space-y-6">
            {changes.map((change, index) => {
              const map = TYPE_MAP[change.type];
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${map.color}`}>
                  
                  {/* Action Header */}
                  <div className="flex items-center justify-between mb-2 border-b pb-2">
                    <span className={`font-extrabold text-lg ${map.color}`}>{map.icon} {map.label}</span>
                    <span className="text-sm text-gray-600">— **{section}**</span>
                  </div>
                  
                  {/* Original Text (targetText) */}
                  {(change.type === 'REVISE' || change.type === 'REMOVE') && change.targetText && (
                    <div className="mb-2 text-sm text-gray-600">
                      <strong className="font-semibold text-gray-800">Original Text:</strong> 
                      <p className="italic bg-white p-1 rounded border border-gray-300 line-through whitespace-pre-wrap">
                        {change.targetText}
                      </p>
                    </div>
                  )}

                  {/* Suggested Text (suggestedText) */}
                  {(change.type === 'ADD' || change.type === 'REVISE') && (
                    <div className="mb-3 text-base">
                      <strong className="font-semibold text-gray-800">Suggested Text:</strong> 
                      <p className="p-1 rounded bg-white font-mono text-sm whitespace-pre-wrap">
                        {change.suggestedText}
                      </p>
                    </div>
                  )}

                  {/* Reason */}
                  <div className="text-sm border-t pt-2 mt-2">
                    <strong className="font-semibold text-gray-800">Reason (JD Alignment):</strong> 
                    <p className="text-gray-700 whitespace-pre-wrap">{change.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionDisplay;