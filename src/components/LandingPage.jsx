import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--surface-0)] text-[var(--text-primary)]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent)] blur-[120px] opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[120px] opacity-10 pointer-events-none animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* Simple Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Link<span style={{ color: 'var(--accent-bright)' }}>Hub</span>
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 mt-12 mb-24 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 border border-[var(--glass-border)] bg-[var(--surface-1)] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">Now in Public Beta</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          Your One Link <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-bright)] to-[var(--accent)]">
            For Everything.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Share your portfolio, social profiles, and content with a single, beautiful, and customizable link. Build your digital presence in seconds.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-[var(--accent-glow)] transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center gap-3 group"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', color: '#fff' }}
        >
          Get Started for Free
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          {[
            { title: "Customizable Themes", desc: "Express yourself with stunning dark and light modes, and personalized accent colors." },
            { title: "Fast Setup", desc: "No coding required. Add your links, customize your profile, and share it with the world instantly." },
            { title: "Blazing Fast", desc: "Built with modern technologies to ensure your profile loads instantly for every visitor." }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]/50 backdrop-blur-md text-left hover:border-[var(--accent)] transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 bg-[var(--surface-2)]">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-[var(--border)] mt-auto">
        <p className="text-sm text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} LinkHub. Designed with <span className="text-[var(--accent)]">♥</span>.
        </p>
      </footer>
    </div>
  );
}
