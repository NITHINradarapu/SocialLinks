import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
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
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") return;
      if (error?.code === "auth/popup-blocked") {
        toast.error("Sign-in popup was blocked. Allow popups for this site and try again.");
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-7 text-center animate-fade-in card-quiet"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--border)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-medium tracking-tight mb-1.5 font-display" style={{ color: "var(--text-primary)" }}>
          Sign in to LinkHub
        </h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>
          Manage your links and profile directory
        </p>

        <button
          id="login-google"
          onClick={handleLogin}
          className="btn-ghost w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-[13px]"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          By continuing, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}
