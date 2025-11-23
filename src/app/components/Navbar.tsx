'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        ResumeForge
                    </span>
                </Link>
                <div className="flex items-center gap-8">
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
                                <span className="text-sm font-medium text-slate-700 hidden md:block">
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
            </div>
        </nav>
    );
}
