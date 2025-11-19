import React from 'react';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#F0F5FF] py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <p className="text-gray-600 mt-4">Perfect for getting started with resume optimization.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                3 Resume Uploads per month
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Basic ATS Keyword Analysis
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Standard Suggestions
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
                            Get Started Free
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-600 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            POPULAR
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$19</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <p className="text-gray-600 mt-4">For serious job seekers who want maximum results.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Unlimited Resume Uploads
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Advanced AI Optimization
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Detailed Formatting Suggestions
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Priority Support
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
