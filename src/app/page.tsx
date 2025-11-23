'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import UploadForm from './components/UploadForm';

function WelcomeMessage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check for welcome parameter in URL or isNewUser flag in session
    const welcomeParam = searchParams.get('welcome');
    const isNewUser = (session?.user as any)?.isNewUser;

    if (welcomeParam === 'true' || isNewUser) {
      setShowWelcome(true);

      // Clear the welcome parameter from URL if present
      if (welcomeParam) {
        const newUrl = window.location.pathname;
        router.replace(newUrl);
      }

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, [searchParams, session, router]);

  if (!showWelcome) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down px-4 max-w-md w-full">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/20 border border-indigo-100 px-4 sm:px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm sm:text-base">Welcome to ResumeForge! 🎉</p>
          <p className="text-xs sm:text-sm text-slate-600 truncate">Let's optimize your resume and land that interview.</p>
        </div>
        <button
          onClick={() => setShowWelcome(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Welcome Toast */}
      <Suspense fallback={null}>
        <WelcomeMessage />
      </Suspense>

      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] left-[20%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-32">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm mb-6 sm:mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-slate-600">AI-Powered Resume Optimization</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 sm:mb-8">
            Beat the ATS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Land the Interview.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8 sm:mb-12 px-4">
            Stop getting rejected by robots. Our AI analyzes your resume against job descriptions to give you actionable, keyword-rich suggestions that get you noticed.
          </p>
        </div>

        <UploadForm />
      </div>
    </main>
  );
}