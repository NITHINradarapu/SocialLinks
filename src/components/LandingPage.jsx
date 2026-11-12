import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   Scroll-reveal hook (calibrated intersection observer)
   ═══════════════════════════════════════════════ */
function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ═══════════════════════════════════════════════
   Platform SVG icons for the ticker bar
   ═══════════════════════════════════════════════ */
const PLATFORM_LOGOS = [
  { name: "GitHub", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
  { name: "LinkedIn", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: "X", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { name: "YouTube", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { name: "Instagram", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { name: "Discord", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 00-.041-.106 13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg> },
  { name: "Spotify", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.685.48-1.05.26-2.81-1.72-6.34-2.11-10.51-1.16-.41.09-.82-.16-.92-.57-.09-.41.16-.82.57-.92 4.56-1.04 8.46-.6 11.6 1.32.36.21.48.68.26 1.05zm1.46-3.27c-.28.45-.87.6-1.32.32-3.22-1.98-8.12-2.55-11.93-1.39-.5.15-1.03-.14-1.18-.65-.15-.5.14-1.03.65-1.18 4.35-1.32 9.77-.68 13.46 1.58.45.28.6.87.32 1.32zm.12-3.37c-.34.56-1.08.74-1.64.4-4-2.38-10.61-2.65-14.47-1.48-.62.19-1.28-.15-1.47-.77-.19-.62.15-1.28.77-1.47 4.61-1.4 11.91-1.08 16.53 1.67.57.34.75 1.08.4 1.65z"/></svg> },
  { name: "LeetCode", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 00-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0013.483 0zm-2.866 12.815a1.38 1.38 0 00-1.38 1.382 1.38 1.38 0 001.38 1.382H20.79a1.38 1.38 0 001.38-1.382 1.38 1.38 0 00-1.38-1.382z"/></svg> },
];

/* ═══════════════════════════════════════════════
   Authentic Phone Directory Preview (no float/bobbing)
   ═══════════════════════════════════════════════ */
function PhoneMockup() {
  const sampleLinks = [
    { label: "github.com/nithin", cat: "CODE", icon: "GH" },
    { label: "linkedin.com/in/nithin", cat: "CAREER", icon: "IN" },
    { label: "nithin.dev/portfolio", cat: "WORK", icon: "WEB" },
    { label: "x.com/nithin", cat: "SOCIAL", icon: "X" },
  ];

  return (
    <div className="relative mx-auto w-[290px] rounded-[32px] p-3 border border-[var(--border)] bg-[var(--surface-1)] shadow-xl">
      {/* Phone chassis */}
      <div className="relative rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-0)] p-5 flex flex-col items-center">
        {/* Speaker / camera pill */}
        <div className="w-16 h-3 rounded-full bg-[var(--surface-3)] mb-6 opacity-60" />

        {/* Profile Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] mb-3 flex items-center justify-center">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
            alt="Preview avatar"
            className="w-full h-full"
          />
        </div>

        {/* Profile text */}
        <h4 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
          Alex Rivera
        </h4>
        <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 mb-4 text-center">
          Systems & interface engineer
        </p>

        {/* Muted index pill */}
        <div className="w-full text-[10px] font-mono tracking-wider text-[var(--text-tertiary)] mb-2 px-1">
          INDEX (4)
        </div>

        {/* Links list */}
        <div className="w-full space-y-2">
          {sampleLinks.map((link) => (
            <div
              key={link.label}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono font-semibold bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {link.icon}
                </span>
                <span className="text-xs font-mono text-[var(--text-primary)] truncate">
                  {link.label}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[var(--text-tertiary)] shrink-0 ml-2">
                {link.cat}
              </span>
            </div>
          ))}
        </div>

        {/* Public profile URL tag */}
        <div className="mt-5 pt-3 w-full border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
          <span>linkhub.app/p/u29</span>
          <span className="text-[var(--accent)]">● live</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Calibrated Dashboard Preview (Graphite surface, no blur wash)
   ═══════════════════════════════════════════════ */
function DashboardPreview() {
  return (
    <div className="max-w-4xl mx-auto rounded-xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden shadow-lg">
      {/* Chrome header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-hover)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-hover)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-hover)]" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-[var(--text-tertiary)]">
            linkhub.app/dashboard
          </span>
        </div>
        <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
          [ 4 LINKS ]
        </div>
      </div>

      {/* Workspace */}
      <div className="p-6 bg-[var(--surface-0)] space-y-4">
        {/* Profile Card Mock */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                alt=""
                className="w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Alex Rivera
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-tertiary)]">
                  FREE TIER
                </span>
              </div>
              <p className="text-xs font-mono text-[var(--text-tertiary)]">
                /p/alexrivera · 4 entries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="btn-ghost text-xs px-2.5 py-1">Edit profile</span>
            <span className="btn-primary text-xs px-2.5 py-1">+ Add link</span>
          </div>
        </div>

        {/* Mock Items list */}
        <div className="space-y-2">
          {[
            { title: "GitHub", url: "https://github.com/alexrivera", cat: "Code", clicks: "320" },
            { title: "LinkedIn", url: "https://linkedin.com/in/alexrivera", cat: "Social", clicks: "184" },
            { title: "Personal Portfolio", url: "https://alexrivera.dev", cat: "Work", clicks: "412" },
          ].map((item, idx) => (
            <div
              key={item.title}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-1)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-[var(--text-tertiary)] select-none">
                  ::
                </span>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  0{idx + 1}
                </span>
                <div className="truncate">
                  <span className="text-xs font-medium text-[var(--text-primary)] mr-2">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                    {item.url}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-tertiary)]">
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                  {item.cat}
                </span>
                <span className="text-[var(--text-secondary)]">
                  {item.clicks} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Section Header (Clean, quiet hierarchy)
   ═══════════════════════════════════════════════ */
function SectionHeader({ tag, title, subtitle }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="scroll-reveal text-center mb-12 max-w-2xl mx-auto">
      {tag && (
        <span className="inline-block font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] mb-3">
          {tag}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main LandingPage Component
   ═══════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const platformBarRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const dashboardRef = useScrollReveal();

  const FEATURES = [
    {
      title: "Single Link Hub",
      desc: "Consolidate your repositories, client work, socials, and contact points into one verified URL.",
      badge: "01",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      title: "Drag & Drop Ordering",
      desc: "Reorder links naturally with pointer or touch. Arrangement is saved instantly to Firestore.",
      badge: "02",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h4m0 0l-2-2m2 2L5 9m14-2h-4m0 0l2-2m-2 2l2 2M3 17h4m0 0l-2-2m2 2l-2 2m14-2h-4m0 0l2-2m-2 2l2 2M9 12h6" />
        </svg>
      ),
    },
    {
      title: "Calibrated Dark & Light",
      desc: "High-contrast, distraction-free surfaces built on balanced graphite and warm paper neutral ramps.",
      badge: "03",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: "Category Grouping",
      desc: "Filter and organize entries by Work, Code, Socials, and Contact for structured visitor navigation.",
      badge: "04",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Clean Public Endpoints",
      desc: "Every profile gets a clean public URL (/p/:uid) with full mobile responsiveness and fast rendering.",
      badge: "05",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
    },
    {
      title: "Google Authentication",
      desc: "Secure, frictionless sign-in via Firebase Auth. No separate password or credential to maintain.",
      badge: "06",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const STEPS = [
    {
      num: "01",
      title: "Sign in with Google",
      desc: "One-click authentication. Profile and link storage is established in Firestore automatically.",
    },
    {
      num: "02",
      title: "Curate your directory",
      desc: "Add your work, code, and social links. Reorder them with drag and drop to highlight what matters.",
    },
    {
      num: "03",
      title: "Share your index",
      desc: "Distribute your /p/:uid link across resumes, bios, and messages. Fast, legible, and responsive.",
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Priya Sharma",
      role: "Product Designer",
      quote: "LinkHub provides exactly what I need: a clean, minimal directory of my case studies and socials without flashy bloat.",
    },
    {
      name: "Marcus Chen",
      role: "Backend Engineer",
      quote: "Drag-and-drop reordering is seamless, and the graphite theme feels right at home alongside terminal tools.",
    },
    {
      name: "Sofia Reyes",
      role: "Technical Writer",
      quote: "Visitors instantly find my articles and code repos without navigating through animated popups or sponsored banners.",
    },
  ];

  return (
    <div className="flex flex-col relative min-h-screen bg-[var(--surface-0)] text-[var(--text-primary)]">
      {/* ═══ 1. HEADER ═══ */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
          scrolled
            ? "bg-[var(--surface-0)] border-[var(--border)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto w-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-xs font-mono font-bold text-[var(--accent)]">
              LH
            </span>
            <span className="text-sm font-semibold tracking-tight">
              LinkHub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/about")}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1"
            >
              About
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary text-xs px-3.5 py-1.5"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* ═══ 2. HERO SECTION ═══ */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-12 md:pt-20 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface-1)] text-[11px] font-mono text-[var(--text-secondary)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span>v2.0 · Personal link directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.12] mb-5 text-[var(--text-primary)]">
              All your work and profiles in one clean link.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 mb-8">
              A distraction-free directory for your portfolio, code, and socials. Built for developers, designers, and creators who value speed and clarity.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <button
                id="hero-cta-primary"
                onClick={() => navigate("/login")}
                className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs font-medium flex items-center justify-center gap-2"
              >
                <span>Get started with Google</span>
                <span className="font-mono text-[10px]">→</span>
              </button>
              <button
                id="hero-cta-secondary"
                onClick={() => {
                  document.getElementById("dashboard-preview")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-ghost w-full sm:w-auto px-4 py-2.5 text-xs font-medium"
              >
                View preview
              </button>
            </div>

            {/* Quiet metadata notes */}
            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-mono text-[var(--text-tertiary)]">
              <span>● No trackers</span>
              <span>● Drag-and-drop</span>
              <span>● Instant Firestore sync</span>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ═══ 3. PLATFORM BAR ═══ */}
      <section className="border-y border-[var(--border)] py-6 bg-[var(--surface-1)]">
        <div ref={platformBarRef} className="scroll-reveal max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] shrink-0">
              Supported Platforms
            </span>
            <div className="flex items-center flex-wrap justify-center gap-6 text-[var(--text-secondary)]">
              {PLATFORM_LOGOS.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity text-xs"
                >
                  {p.icon}
                  <span className="font-mono text-[11px]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. DASHBOARD PREVIEW ═══ */}
      <section id="dashboard-preview" className="py-20 px-6 max-w-5xl mx-auto w-full">
        <SectionHeader
          tag="[ Interface ]"
          title="Designed for focused management"
          subtitle="A quiet, utilitarian dashboard with zero clutter. Add links, reorder entries, and publish updates in seconds."
        />
        <div ref={dashboardRef} className="scroll-reveal">
          <DashboardPreview />
        </div>
      </section>

      {/* ═══ 5. HOW IT WORKS ═══ */}
      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--surface-1)]">
        <div className="max-w-5xl mx-auto w-full">
          <SectionHeader
            tag="[ Workflow ]"
            title="Three steps to your profile"
            subtitle="Get your public link operational in under a minute."
          />

          <div ref={stepsRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-lg border border-[var(--border)] bg-[var(--surface-0)] text-left flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-[var(--accent)] mb-3 block">
                    /{step.num}
                  </span>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. FEATURES GRID ═══ */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <SectionHeader
          tag="[ Capabilities ]"
          title="Engineered for clarity and control"
          subtitle="Every feature is designed to reduce friction and present your work clearly."
        />

        <div ref={featuresRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-left hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="flex items-center justify-between mb-3 text-[var(--accent)]">
                <div className="w-8 h-8 rounded bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                  {feature.icon}
                </div>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. TESTIMONIALS ═══ */}
      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--surface-1)]">
        <div className="max-w-5xl mx-auto w-full">
          <SectionHeader
            tag="[ Perspectives ]"
            title="Used by developers and designers"
            subtitle="Real feedback from creators who prioritize performance and signal."
          />

          <div ref={testimonialsRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface-0)] flex flex-col justify-between"
              >
                <p className="text-xs leading-relaxed text-[var(--text-secondary)] mb-6">
                  "{t.quote}"
                </p>
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <p className="text-xs font-medium text-[var(--text-primary)]">
                    {t.name}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-tertiary)]">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. FINAL CTA ═══ */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full text-center">
        <div
          ref={ctaRef}
          className="scroll-reveal p-10 md:p-14 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] max-w-2xl mx-auto"
        >
          <span className="font-mono text-[11px] text-[var(--accent)] uppercase tracking-wider block mb-3">
            [ Ready ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] mb-3">
            Build your personal directory now.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto leading-relaxed">
            Sign in with Google, add your links, and share your clean public profile in seconds.
          </p>
          <button
            id="final-cta"
            onClick={() => navigate("/login")}
            className="btn-primary px-6 py-2.5 text-xs font-medium"
          >
            Create Your LinkHub →
          </button>
          <p className="mt-4 text-[10px] font-mono text-[var(--text-tertiary)]">
            Free forever · Instant setup · No credit card
          </p>
        </div>
      </section>

      {/* ═══ 9. FOOTER ═══ */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface-0)] py-8 text-xs text-[var(--text-tertiary)]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[10px] font-mono text-[var(--accent)]">
              LH
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              LinkHub · Personal Directory
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <button
              onClick={() => navigate("/about")}
              className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-none p-0"
            >
              About
            </button>
            <button
              onClick={() => document.getElementById("dashboard-preview")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-none p-0"
            >
              Preview
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-none p-0"
            >
              Sign In
            </button>
          </div>

          <span className="font-mono text-[10px]">
            © {new Date().getFullYear()} · React + Firebase
          </span>
        </div>
      </footer>
    </div>
  );
}
