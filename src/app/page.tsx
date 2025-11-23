import UploadForm from './components/UploadForm';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-600">AI-Powered Resume Optimization</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8">
            Beat the ATS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Land the Interview.
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            Stop getting rejected by robots. Our AI analyzes your resume against job descriptions to give you actionable, keyword-rich suggestions that get you noticed.
          </p>
        </div>

        <UploadForm />
      </div>
    </main>
  );
}