import { useNavigate, useLocation } from "react-router-dom";
import { signInWithGoogle } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none animate-glow-pulse"
        style={{ background: 'var(--accent)', opacity: 0.1 }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-15%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none animate-glow-pulse"
        style={{ background: 'rgba(139, 92, 246, 0.8)', opacity: 0.08, animationDelay: '2s' }}
      ></div>

      {/* Floating decorative icons */}
      <div className="absolute top-[15%] left-[10%] opacity-[0.06] pointer-events-none animate-float" style={{ animationDelay: '0s' }}>
        <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="var(--accent)" strokeWidth="1">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      </div>
      <div className="absolute bottom-[20%] right-[12%] opacity-[0.06] pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="var(--accent)" strokeWidth="1">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center relative z-10 animate-scale-in"
        style={{
          background: "var(--glass)",
          border: "1px solid var(--glass-border)",
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
              boxShadow: '0 8px 24px var(--accent-glow)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 font-display" style={{ color: "var(--text-primary)" }}>
          Welcome to Link<span style={{ color: "var(--accent-bright)" }}>Hub</span>
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Sign in to manage your links and profile
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          style={{
            background: "var(--surface-2)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>

        {/* Bottom hint */}
        <p className="mt-6 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
