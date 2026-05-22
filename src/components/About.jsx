import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-fade-in-up">
      <div
        className="p-8 rounded-3xl relative overflow-hidden"
        style={{
          background: "var(--glass)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-[var(--accent)] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 rounded-full bg-blue-500 opacity-10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <div className="flex flex-col items-center text-center mb-10">
            <div
              className="w-24 h-24 rounded-2xl mb-6 flex items-center justify-center p-1 shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-dim))",
              }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden bg-[var(--surface-2)]">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Nithin"
                  alt="Nithin Radarapu"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1
              className="text-3xl font-extrabold mb-2 tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Nithin Radarapu
            </h1>
            <p className="text-[var(--text-secondary)] font-medium">
              Developer & Creator
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ color: "var(--accent-bright)" }}
              >
                <span className="w-6 h-px bg-[var(--accent-glow)]"></span>
                About Me
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
                I'm Nithin Radarapu, a passionate developer focused on building
                modern, user-centric digital experiences. LinkHub is a project
                born out of the need for a clean, fast, and customizable way to
                share all your important links in one place.
              </p>
            </section>

            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ color: "var(--accent-bright)" }}
              >
                <span className="w-6 h-px bg-[var(--accent-glow)]"></span>
                Get In Touch
              </h2>
              <div className="grid gap-3">
                <a
                  href="mailto:contact@nithin.dev"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:translate-x-1 group"
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface-2)] text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                      Email
                    </div>
                    <div className="text-[14px] font-semibold text-[var(--text-primary)] break-all">
                      radarapunithin05@gmail.com
                    </div>
                  </div>
                </a>

                <a
                  href="https://github.com/NITHINradarapu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:translate-x-1 group"
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                      GitHub
                    </div>
                    <div className="text-[14px] font-semibold text-[var(--text-primary)] break-all">
                      github.com/NITHINradarapu
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/nithin-radarapu05/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:translate-x-1 group"
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface-2)] text-[#0077b5] group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                      LinkedIn
                    </div>
                    <div className="text-[14px] font-semibold text-[var(--text-primary)] break-all">
                      https://www.linkedin.com/in/nithin-radarapu05/
                    </div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
