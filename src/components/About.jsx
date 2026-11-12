import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const contactLinks = [
    {
      label: 'Email',
      value: 'radarapunithin05@gmail.com',
      href: 'mailto:radarapunithin05@gmail.com',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      value: 'github.com/NITHINradarapu',
      href: 'https://github.com/NITHINradarapu',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/nithin-radarapu05',
      href: 'https://www.linkedin.com/in/nithin-radarapu05/',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-fade-in">
      <div
        className="p-6 sm:p-7 rounded-2xl border card-quiet"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--border)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-20 h-20 rounded-full border overflow-hidden p-0.5 mb-3.5"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface-2)',
            }}
          >
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Nithin"
              alt="Nithin Radarapu"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-medium tracking-tight font-display" style={{ color: "var(--text-primary)" }}>
            Nithin Radarapu
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Developer & Creator
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-[11px] font-mono-meta font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
              About
            </h2>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
              I built LinkHub as a clean, fast, and serverless directory to curate and share all important links in one place without bloat or tracking.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-mono-meta font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
              Contact
            </h2>
            <div className="flex flex-col gap-2">
              {contactLinks.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.label !== 'Email' ? '_blank' : undefined}
                  rel={contact.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-[var(--surface-2)]"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {contact.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono-meta text-[var(--text-tertiary)] uppercase tracking-wider">
                      {contact.label}
                    </div>
                    <div className="text-[13px] font-medium text-[var(--text-primary)] truncate font-mono-meta">
                      {contact.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
