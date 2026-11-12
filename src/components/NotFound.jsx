import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-sm animate-fade-in flex flex-col items-center">
        <span className="text-[12px] font-mono-meta font-medium px-2.5 py-1 rounded-md border mb-4" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          404 error
        </span>
        
        <h1 className="text-2xl font-medium mb-2 font-display" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        
        <p className="text-[13.5px] mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          The page or user profile you are looking for does not exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="btn-primary px-4 py-2 text-[13px] inline-flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Return home</span>
        </button>
      </div>
    </div>
  );
}
