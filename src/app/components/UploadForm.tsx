'use client';

import React, { useState, FormEvent } from 'react';
import SuggestionDisplay, { type LLMSuggestions } from './SuggestionDisplay';

interface ApiResponse {
  status: string;
  extractedResumeText: string;
  jobDescriptionReceived: string;
  llmSuggestions: LLMSuggestions;
}


const UploadForm: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);
    setApiResponse(null);

    if (!resumeFile || !jobDescription.trim()) {
      setResponseMessage('Please upload a resume and paste the job description.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resumeFile', resumeFile);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'An unknown error occurred during processing.';
        setResponseMessage(`Error: ${errorMessage}`);
        return;
      }

      setResponseMessage('Successfully processed file and received LLM placeholder data!');
      setApiResponse(data as ApiResponse);

    } catch (error) {
      console.error('Submission failed:', error);
      setResponseMessage('A network error occurred. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🚀 ResumeForge: Get Suggestions</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Resume Upload Field */}
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
            1. Upload Resume (PDF or DOCX)
          </label>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
            required
          />
        </div>

        {/* Job Description Textarea */}
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            2. Paste Job Description (JD)
          </label>
          <textarea
            id="jobDescription"
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 block w-full p-3 border text-gray-800 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste the full job description text here..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 border border-transparent rounded-lg text-lg font-medium text-white shadow-sm transition duration-150 
            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
          }
        >
          {loading ? 'Processing... Please wait' : 'Analyze & Get Suggestions'}
        </button>
      </form>

      {apiResponse && (
        <div className="mt-8">
          <p className="font-semibold text-green-600">{responseMessage}</p>
          <div className="mt-6">
            <SuggestionDisplay suggestions={apiResponse.llmSuggestions} />
          </div>
        </div>
      )}

      {(!apiResponse && responseMessage) && (
        <div className="mt-8">
          <p className="font-semibold text-red-600">{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;