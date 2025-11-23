'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2v4" />
                            <path d="m16.2 7.8 2.9-2.9" />
                            <path d="M18 12h4" />
                            <path d="m16.2 16.2 2.9 2.9" />
                            <path d="M12 18v4" />
                            <path d="m7.8 16.2-2.9 2.9" />
                            <path d="M2 12h4" />
                            <path d="m7.8 7.8-2.9-2.9" />
                        </svg>
                    </div>
                    <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        ResumeForge
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        How it works
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Pricing
                    </Link>
                    {session ? (
                        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                    {session.user?.name?.[0] || 'U'}
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden lg:block">
                                    {session.user?.name}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/signin"
                            className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all active:scale-95"
                        >
                            Sign in
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/how-it-works"
                            className="block py-3 px-4 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            How it works
                        </Link>
                        <Link
                            href="/pricing"
                            className="block py-3 px-4 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 py-3 px-4 border-t border-slate-200">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                        {session.user?.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-base font-medium text-slate-700">
                                        {session.user?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full py-3 px-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/signin"
                                className="block py-3 px-4 text-center bg-indigo-600 text-white text-base font-medium rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
