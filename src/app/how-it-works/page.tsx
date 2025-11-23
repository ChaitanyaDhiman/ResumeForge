import React from 'react';

export default function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: "Upload Your Resume",
            description: "Upload your existing resume in PDF, DOC, or DOCX format. Our secure system parses your information instantly.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            )
        },
        {
            number: 2,
            title: "Paste Job Description",
            description: "Copy and paste the job description you're applying for. We analyze the keywords and requirements.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            )
        },
        {
            number: 3,
            title: "Get AI Suggestions",
            description: "Our AI identifies gaps and provides tailored suggestions to optimize your resume for the specific role.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen py-20 px-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        How ResumeForge Works
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Optimize your resume in three simple steps and increase your chances of landing an interview.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((step) => (
                        <div key={step.number} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-indigo-500/5 border border-white/50 hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                                {step.icon}
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                                    {step.number}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-1"
                    >
                        Start Optimizing Now
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
