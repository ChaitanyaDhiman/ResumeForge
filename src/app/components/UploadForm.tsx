'use client';

import { useState } from 'react';
import SuggestionDisplay from './SuggestionDisplay';

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

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LLMSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleContinue = async () => {
    if (currentStep === 1 && file) {
      setCurrentStep(2);
    } else if (currentStep === 2 && jobDescription.trim()) {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        if (file) formData.append('resumeFile', file);
        formData.append('jobDescription', jobDescription);

        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to optimize resume');
        }

        const data = await response.json();
        setSuggestions(data.llmSuggestions);
        setCurrentStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Beat the ATS.
          <br />
          Land the Interview.
        </h1>
        <p className="text-lg text-gray-600">
          AI-powered resume optimization tailored to any job description
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-12 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
          <span className={`${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Upload</span>
        </div>
        <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
          <span className={`${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Optimize</span>
        </div>
        <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>3</div>
          <span className={`${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>Suggestions</span>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing...</h2>
            <p className="text-gray-600">Please wait while we process your request.</p>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Upload Your Resume</h2>

                <div
                  className="border-2 border-dashed border-blue-200 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium mb-2">
                    {file ? file.name : 'Drop your resume here or click to browse'}
                  </p>
                  <p className="text-gray-500 text-sm">PDF, DOC, DOCX up to 10MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Paste Job Description</h2>
                <textarea
                  className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4 text-gray-900 placeholder-gray-400"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && suggestions && (
              <SuggestionDisplay suggestions={suggestions} />
            )}

            <div className="flex gap-4 mt-8 max-w-2xl mx-auto">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-xl transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={handleContinue}
                  disabled={currentStep === 1 && !file || currentStep === 2 && !jobDescription.trim()}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${(currentStep === 1 && !file || currentStep === 2 && !jobDescription.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {currentStep === 2 ? 'Optimize' : 'Continue'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}