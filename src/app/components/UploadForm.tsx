'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LLMSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

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
      // Check if user is authenticated before generating suggestions
      if (status === 'unauthenticated') {
        setShowSignInModal(true);
        return;
      }

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
          let errorMsg = 'Failed to optimize resume';
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            console.error('Failed to parse error response:', e);
            errorMsg = `Server Error (${response.status}): The server returned an invalid response.`;
          }
          throw new Error(errorMsg);
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Sign-In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h2>
              <p className="text-slate-600">Please sign in to generate AI-powered resume suggestions</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/signin?callbackUrl=/')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[
          { step: 1, label: 'Upload' },
          { step: 2, label: 'Optimize' },
          { step: 3, label: 'Suggestions' }
        ].map((item, index) => (
          <div key={item.step} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${currentStep >= item.step
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white/50 text-slate-400'
              }`}>
              <span className="font-bold">{item.step}</span>
              <span className="font-medium hidden md:block">{item.label}</span>
            </div>
            {index < 2 && (
              <div className={`w-12 h-0.5 mx-2 ${currentStep > item.step ? 'bg-indigo-200' : 'bg-slate-200'
                }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/50 p-8 md:p-12 transition-all">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your resume...</h2>
            <p className="text-slate-500">Our AI is finding the best keywords for you.</p>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <div className="text-center">
                <div
                  className={`group border-3 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${file
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'
                    }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                    }`}>
                    {file ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {file ? file.name : 'Upload your resume'}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {file ? 'Click to change file' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    PDF, DOCX up to 10MB
                  </p>
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
              <div className="h-full">
                <label className="block text-sm font-semibold text-slate-700 mb-4 ml-1">
                  Job Description
                </label>
                <textarea
                  className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-400 transition-all text-base leading-relaxed"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && suggestions && (
              <SuggestionDisplay suggestions={suggestions} />
            )}

            <div className="flex gap-4 mt-10">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-8 py-4 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={handleContinue}
                  disabled={currentStep === 1 && !file || currentStep === 2 && !jobDescription.trim()}
                  className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none`}
                >
                  {currentStep === 2 ? 'Generate Suggestions' : 'Continue'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}