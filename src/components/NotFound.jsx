import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--surface-0)] text-[var(--text-primary)] px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--danger)] blur-[150px] opacity-8 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
        {/* Broken Link Illustration */}
        <div className="mb-6 relative">
          <svg className="w-24 h-24 animate-float" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            {/* Break line */}
            <line x1="8" y1="8" x2="16" y2="16" strokeWidth="2.5" style={{ stroke: 'var(--danger)' }} />
          </svg>
        </div>

        <div className="relative">
          <h1 className="text-[100px] sm:text-[140px] font-black leading-none tracking-tighter text-transparent bg-clip-text select-none font-display"
            style={{
              backgroundImage: 'linear-gradient(180deg, var(--surface-3) 0%, var(--surface-0) 100%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <span
              className="text-xl sm:text-2xl font-bold px-5 py-2.5 rounded-xl text-[var(--danger)]"
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              Page Not Found
            </span>
          </div>
        </div>
        
        <p className="mt-8 text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Oops! It seems you've ventured into the unknown. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="btn-shimmer mt-10 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
            color: '#fff',
            border: 'none',
            boxShadow: '0 8px 24px var(--accent-glow), var(--shadow-lg)',
          }}
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </button>
      </div>
    </div>
  );
}
