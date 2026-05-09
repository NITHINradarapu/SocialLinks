import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--surface-0)] text-[var(--text-primary)] px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--danger)] blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
        <div className="relative">
          <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[var(--surface-3)] to-[var(--surface-0)] drop-shadow-sm select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <span className="text-2xl sm:text-3xl font-bold bg-[var(--surface-0)] px-4 py-2 rounded-xl border border-[var(--border)] shadow-xl text-[var(--danger)]">
              Page Not Found
            </span>
          </div>
        </div>
        
        <p className="mt-8 text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Oops! It seems you've ventured into the unknown. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="mt-10 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', color: '#fff', border: 'none' }}
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
