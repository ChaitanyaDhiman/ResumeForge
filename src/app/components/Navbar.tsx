import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white">
            <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-md">
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
                <span className="text-xl font-bold text-gray-900">ResumeForge</span>
            </Link>
            <div className="flex items-center gap-8">
                <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    How it works
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pricing
                </Link>
                <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Sign in
                </Link>
            </div>
        </nav>
    );
}
