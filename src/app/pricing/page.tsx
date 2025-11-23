import React from 'react';

export default function Pricing() {
    return (
        <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-[20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-indigo-500/5 border border-white/50 flex flex-col hover:shadow-indigo-500/10 transition-all duration-300">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-900">$0</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <p className="text-slate-600 mt-4">Perfect for getting started with resume optimization.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                3 Resume Uploads per month
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Basic ATS Keyword Analysis
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Standard Suggestions
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                            Get Started Free
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 border-2 border-indigo-600 flex flex-col relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            POPULAR
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-900">$19</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <p className="text-slate-600 mt-4">For serious job seekers who want maximum results.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Unlimited Resume Uploads
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Advanced AI Optimization
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Detailed Formatting Suggestions
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Priority Support
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
