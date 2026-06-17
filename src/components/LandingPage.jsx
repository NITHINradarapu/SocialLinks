import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   Rotating hero text
   ═══════════════════════════════════════════════ */
const ROTATING_WORDS = ["Everything.", "Creators.", "Developers.", "Designers.", "Brands."];

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-block gradient-text"
      style={{
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? "translateY(12px)" : "translateY(0)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {ROTATING_WORDS[index]}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   Scroll-reveal hook
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ═══════════════════════════════════════════════
   Animated counter (counts up on scroll)
   ═══════════════════════════════════════════════ */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 30);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="animate-count-up">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   Platform SVG icons for the scrolling bar
   ═══════════════════════════════════════════════ */
const PLATFORM_LOGOS = [
  { name: "GitHub", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
  { name: "LinkedIn", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: "X / Twitter", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { name: "YouTube", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { name: "Instagram", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { name: "Discord", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 00-.041-.106 13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg> },
  { name: "Spotify", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.685.48-1.05.26-2.81-1.72-6.34-2.11-10.51-1.16-.41.09-.82-.16-.92-.57-.09-.41.16-.82.57-.92 4.56-1.04 8.46-.6 11.6 1.32.36.21.48.68.26 1.05zm1.46-3.27c-.28.45-.87.6-1.32.32-3.22-1.98-8.12-2.55-11.93-1.39-.5.15-1.03-.14-1.18-.65-.15-.5.14-1.03.65-1.18 4.35-1.32 9.77-.68 13.46 1.58.45.28.6.87.32 1.32zm.12-3.37c-.34.56-1.08.74-1.64.4-4-2.38-10.61-2.65-14.47-1.48-.62.19-1.28-.15-1.47-.77-.19-.62.15-1.28.77-1.47 4.61-1.4 11.91-1.08 16.53 1.67.57.34.75 1.08.4 1.65z"/></svg> },
  { name: "TikTok", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.36-.64-.46-1.19-1.05-1.63-1.72-.01 3.43 0 6.87-.02 10.3-.11 2.07-.98 4.08-2.49 5.5-1.95 1.87-4.78 2.73-7.46 2.34-2.63-.36-5.01-1.93-6.44-4.15-1.42-2.21-1.77-5.07-.97-7.56.81-2.53 2.72-4.6 5.12-5.67 1.37-.59 2.87-.84 4.36-.76v4.15c-.77-.24-1.62-.27-2.42-.09-1.34.27-2.52 1.17-3.14 2.38-.6 1.14-.67 2.54-.2 3.73.45 1.23 1.48 2.2 2.72 2.57 1.23.4 2.61.21 3.68-.5 1.1-.72 1.82-1.96 1.97-3.3.02-1.36.01-2.72.01-4.08 0-4.97 0-9.95 0-14.93z"/></svg> },
  { name: "LeetCode", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 00-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0013.483 0zm-2.866 12.815a1.38 1.38 0 00-1.38 1.382 1.38 1.38 0 001.38 1.382H20.79a1.38 1.38 0 001.38-1.382 1.38 1.38 0 00-1.38-1.382z"/></svg> },
  { name: "Dribbble", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.174 10.174 0 004.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4a10.15 10.15 0 006.29 2.166c1.42 0 2.77-.29 4.006-.816zM3.616 18.56c.24-.4 3.045-4.97 8.332-6.66.133-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.46 2.96 11.394 2.39 11.39c-.01.18-.01.36-.01.54 0 2.46.88 4.73 2.33 6.52h.012l-.105.11zM2.64 9.48c.57.01 4.24.04 8.17-1.24a64.507 64.507 0 00-3.276-5.127C5.2 4.4 3.38 6.7 2.64 9.48zM9.6 2.45c.13.19 1.86 2.7 3.3 5.21 3.15-1.18 4.48-2.97 4.64-3.21A10.09 10.09 0 0012 2.06c-.82 0-1.62.14-2.4.39zm9.24 3.12c-.2.27-1.68 2.17-4.97 3.52.25.51.49 1.03.71 1.56.08.18.15.37.22.55 3.44-.43 6.86.26 7.2.33a10.14 10.14 0 00-3.16-5.96z"/></svg> },
];

/* ═══════════════════════════════════════════════
   Phone Mockup Component
   ═══════════════════════════════════════════════ */
function PhoneMockup() {
  const sampleLinks = [
    { platform: "GitHub", color: "#8b949e", bg: "rgba(110,118,129,0.15)" },
    { platform: "LinkedIn", color: "#5ba3d9", bg: "rgba(10,102,194,0.15)" },
    { platform: "X / Twitter", color: "#e1e1e1", bg: "rgba(110,118,129,0.15)" },
    { platform: "Portfolio", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  ];

  return (
    <div className="phone-mockup">
      <div
        className="phone-mockup-inner relative mx-auto"
        style={{
          width: "280px",
          height: "560px",
          borderRadius: "40px",
          background: "var(--surface-1)",
          border: "3px solid var(--surface-3)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 40px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: "120px",
            height: "28px",
            background: "var(--surface-0)",
            borderRadius: "0 0 20px 20px",
          }}
        />

        {/* Screen Content */}
        <div className="p-5 pt-10 flex flex-col items-center">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full mb-3"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
              padding: "2.5px",
            }}
          >
            <div
              className="w-full h-full rounded-full overflow-hidden"
              style={{ background: "var(--surface-2)" }}
            >
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                alt="Profile"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Name & Bio */}
          <p
            className="text-sm font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Alex Rivera
          </p>
          <p
            className="text-[10px] mt-0.5 mb-5"
            style={{ color: "var(--text-tertiary)" }}
          >
            Full-stack developer & creator
          </p>

          {/* Sample links */}
          <div className="w-full flex flex-col gap-2">
            {sampleLinks.map((link, i) => (
              <div
                key={link.platform}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl animate-slide-up-spring"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  animationDelay: `${0.8 + i * 0.12}s`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: link.bg, color: link.color }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{link.platform}</p>
                  <div className="h-1.5 mt-1 rounded-full" style={{ background: "var(--surface-3)", width: `${60 + i * 8}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Share button mock */}
          <div
            className="mt-4 w-full py-2 rounded-xl text-center text-[11px] font-semibold animate-slide-up-spring"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
              color: "#fff",
              animationDelay: "1.3s",
              boxShadow: "0 4px 16px var(--accent-glow)",
            }}
          >
            Share Profile
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Dashboard Preview Component
   ═══════════════════════════════════════════════ */
function DashboardPreview() {
  return (
    <div className="browser-mockup max-w-4xl mx-auto">
      <div
        className="browser-mockup-inner rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25), 0 0 60px var(--accent-glow)",
        }}
      >
        {/* Browser chrome bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            background: "var(--surface-2)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div
            className="flex-1 mx-3 py-1.5 px-4 rounded-lg text-[11px]"
            style={{
              background: "var(--surface-1)",
              color: "var(--text-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            linkhub.app/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6" style={{ background: "var(--surface-1)" }}>
          {/* Nav mock */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>
                Link<span style={{ color: "var(--accent-bright)" }}>Hub</span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: "var(--accent-glow)", color: "var(--accent-bright)", border: "1px solid rgba(129,140,248,0.1)" }}>4</div>
              <div className="px-3 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dim))", color: "#fff" }}>+ Add Link</div>
            </div>
          </div>

          {/* Profile card mock */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl mb-4"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="w-14 h-14 rounded-full" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dim))", padding: "2px" }}>
              <div className="w-full h-full rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="" className="w-full h-full" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>Alex Rivera</p>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Full-stack developer & creator</p>
              <p className="text-[9px] mt-1" style={{ color: "var(--accent)" }}>linkhub.app/alex</p>
            </div>
            <div className="flex gap-1.5">
              <div className="px-2.5 py-1.5 rounded-lg text-[10px]" style={{ background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Edit</div>
              <div className="px-2.5 py-1.5 rounded-lg text-[10px]" style={{ background: "var(--accent-glow)", color: "var(--accent-bright)" }}>Share</div>
            </div>
          </div>

          {/* Link cards mock */}
          {[
            { name: "GitHub", color: "#8b949e", bg: "rgba(110,118,129,0.15)", url: "github.com/alexrivera" },
            { name: "LinkedIn", color: "#5ba3d9", bg: "rgba(10,102,194,0.15)", url: "linkedin.com/in/alexrivera" },
            { name: "Portfolio", color: "#34d399", bg: "rgba(52,211,153,0.15)", url: "alexrivera.dev" },
          ].map((link) => (
            <div
              key={link.name}
              className="flex items-center gap-3 p-3 rounded-xl mb-2"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: link.bg, color: link.color }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>{link.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{link.url}</p>
              </div>
              <div className="flex gap-1">
                <div className="px-2 py-1 rounded-md text-[9px]" style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Copy</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Section Header Component
   ═══════════════════════════════════════════════ */
function SectionHeader({ badge, title, subtitle }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="scroll-reveal text-center mb-14 max-w-2xl mx-auto">
      {badge && (
        <span
          className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-5"
          style={{
            background: "var(--accent-glow)",
            color: "var(--accent-bright)",
            border: "1px solid rgba(129,140,248,0.15)",
          }}
        >
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-display" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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

  // Track scroll for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-reveal refs for individual sections
  const platformBarRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const dashboardRef = useScrollReveal();

  const FEATURES = [
    {
      title: "Customizable Themes",
      desc: "Express yourself with stunning dark and light modes, and personalized accent colors that match your brand.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: "Lightning Fast Setup",
      desc: "No coding required. Add your links, customize your profile, and share it with the world in under 60 seconds.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Blazing Performance",
      desc: "Built with modern technologies ensuring your profile loads instantly for every visitor, everywhere.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    },
    {
      title: "Drag & Drop Reorder",
      desc: "Organize your links exactly how you want. Drag and drop to rearrange the order visitors see them.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h4m0 0l-2-2m2 2L5 9m14-2h-4m0 0l2-2m-2 2l2 2M3 17h4m0 0l-2-2m2 2l-2 2m14-2h-4m0 0l2-2m-2 2l2 2M9 12h6" />
        </svg>
      ),
    },
    {
      title: "Custom Usernames",
      desc: "Claim your unique username and get a clean, memorable URL like linkhub.app/yourname to share everywhere.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: "Share Anywhere",
      desc: "One-click copy your public profile link. Perfect for bios, emails, resumes, and social media profiles.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
    },
  ];

  const STEPS = [
    {
      num: "01",
      title: "Create Your Account",
      desc: "Sign up instantly with Google. No credit card, no forms, no friction.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Add Your Links",
      desc: "Paste your profile URLs — GitHub, LinkedIn, Twitter, portfolio, anything.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Share Everywhere",
      desc: "Copy your unique link and drop it in your bio, resume, or anywhere you want.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Priya Sharma",
      role: "UX Designer",
      avatar: "Aneka",
      quote: "LinkHub replaced my old Linktree. The themes are gorgeous and it loads way faster. My portfolio traffic increased by 40%!",
      stars: 5,
    },
    {
      name: "Marcus Chen",
      role: "Full-Stack Developer",
      avatar: "Jasper",
      quote: "Finally, a link-in-bio tool that doesn't look generic. The dark mode and custom accent colors make my profile feel truly mine.",
      stars: 5,
    },
    {
      name: "Sofia Reyes",
      role: "Content Creator",
      avatar: "Sophie",
      quote: "Setup took literally 30 seconds. I love how I can drag and drop to reorder my links. My followers find everything so easily now.",
      stars: 5,
    },
  ];

  return (
    <div className="flex flex-col relative overflow-hidden bg-[var(--surface-0)] text-[var(--text-primary)]">

      {/* ═══ Ambient Background ═══ */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none animate-glow-pulse" style={{ background: "var(--accent)", opacity: 0.1 }} />
      <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[45%] rounded-full blur-[140px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(139,92,246,0.8)", opacity: 0.06, animationDelay: "2s" }} />
      <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] rounded-full blur-[100px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(59,130,246,0.6)", opacity: 0.05, animationDelay: "4s" }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.25,
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black 20%, transparent 70%)",
        }}
      />

      {/* ═══ 1. HEADER ═══ */}
      <header
        className="sticky top-0 z-50 transition-all duration-300 animate-fade-in"
        style={{
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-xs)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dim))" }}
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              Link<span style={{ color: "var(--accent-bright)" }}>Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/about")}
              className="hidden sm:block text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--text-secondary)", background: "none", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              About
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* ═══ 2. HERO SECTION ═══ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-slide-up-spring"
              style={{
                border: "1px solid var(--glass-border)",
                background: "var(--glass)",
                backdropFilter: "blur(12px)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Now in Public Beta</span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08] font-display animate-slide-up-spring"
              style={{ animationDelay: "0.1s" }}
            >
              Your One Link{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">For </span>
              <RotatingText />
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-slide-up-spring"
              style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}
            >
              Share your portfolio, social profiles, and content with a single, beautiful, and customizable link. Build your digital presence in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-slide-up-spring" style={{ animationDelay: "0.3s" }}>
              <button
                id="hero-cta-primary"
                onClick={() => navigate("/login")}
                className="btn-shimmer animate-cta-glow px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 group"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
                  color: "#fff",
                }}
              >
                Get Started — It's Free
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                id="hero-cta-secondary"
                onClick={() => {
                  document.getElementById("dashboard-preview")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                style={{
                  background: "transparent",
                  color: "var(--text-secondary)",
                  border: "1.5px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                See Preview
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start animate-slide-up-spring" style={{ animationDelay: "0.4s" }}>
              <div className="flex -space-x-2.5">
                {["Felix", "Mia", "Sophie", "Jasper", "Aneka"].map((name) => (
                  <img
                    key={name}
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`}
                    alt={name}
                    className="w-8 h-8 rounded-full border-2"
                    style={{ borderColor: "var(--surface-0)", background: "var(--surface-2)" }}
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  <AnimatedCounter target={1200} suffix="+" />
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>creators already onboard</p>
              </div>
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="flex-shrink-0 animate-slide-up-spring" style={{ animationDelay: "0.5s" }}>
            <div className="animate-float-slow">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. PLATFORM SCROLL BAR ═══ */}
      <section className="relative z-10 py-12 overflow-hidden">
        <div className="section-divider mb-12" />
        <div ref={platformBarRef} className="scroll-reveal">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] mb-8" style={{ color: "var(--text-tertiary)" }}>
            Works with all your favorite platforms
          </p>
          <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
            <div className="animate-scroll-logos flex items-center gap-12 w-max">
              {[...PLATFORM_LOGOS, ...PLATFORM_LOGOS].map((p, i) => (
                <div key={`${p.name}-${i}`} className="flex items-center gap-2 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300" style={{ color: "var(--text-secondary)" }}>
                  {p.icon}
                  <span className="text-sm font-medium whitespace-nowrap">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider mt-12" />
      </section>

      {/* ═══ 4. DASHBOARD PREVIEW ═══ */}
      <section id="dashboard-preview" className="relative z-10 py-20 md:py-28 px-6">
        <SectionHeader
          badge="Product Preview"
          title={<>See Your <span className="gradient-text">Dashboard</span> in Action</>}
          subtitle="A clean, powerful interface to manage all your links in one place. No clutter, no distractions — just beautiful simplicity."
        />
        <div ref={dashboardRef} className="scroll-reveal">
          <DashboardPreview />
        </div>
      </section>

      {/* ═══ 5. HOW IT WORKS ═══ */}
      <section className="relative z-10 py-20 md:py-28 px-6 landing-mesh-bg">
        <SectionHeader
          badge="How It Works"
          title={<>Three Steps to Your <span className="gradient-text">Digital Hub</span></>}
          subtitle="Get up and running in under a minute. It's that simple."
        />

        <div ref={stepsRef} className="scroll-reveal max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 stagger-children revealed">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="relative text-center group">
                {/* Connector line (desktop only) */}
                {idx < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px"
                    style={{ background: "linear-gradient(90deg, var(--accent), transparent)", opacity: 0.2 }}
                  />
                )}

                {/* Step number circle */}
                <div className="relative inline-flex mb-5">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      background: "var(--glass)",
                      border: "1px solid var(--border)",
                      backdropFilter: "blur(12px)",
                      color: "var(--accent)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md), 0 0 24px var(--accent-glow)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
                      color: "#fff",
                      boxShadow: "0 2px 8px var(--accent-glow)",
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 font-display" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-[260px] mx-auto" style={{ color: "var(--text-tertiary)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. FEATURES GRID ═══ */}
      <section className="relative z-10 py-20 md:py-28 px-6">
        <SectionHeader
          badge="Features"
          title={<>Everything You Need, <span className="gradient-text">Nothing You Don't</span></>}
          subtitle="Packed with powerful features designed to make your online presence shine."
        />

        <div ref={featuresRef} className="scroll-reveal max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children revealed">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 gradient-border"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--glass)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md), 0 0 24px var(--accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "var(--accent-glow)",
                    color: "var(--accent)",
                    border: "1px solid rgba(129,140,248,0.1)",
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 font-display">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. TESTIMONIALS ═══ */}
      <section className="relative z-10 py-20 md:py-28 px-6 landing-mesh-bg">
        <SectionHeader
          badge="Testimonials"
          title={<>Loved by <span className="gradient-text">Creators</span> Worldwide</>}
          subtitle="Don't just take our word for it. Here's what our users have to say."
        />

        <div ref={testimonialsRef} className="scroll-reveal max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children revealed">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="testimonial-card p-6 rounded-2xl"
                style={{
                  background: "var(--glass)",
                  border: "1px solid var(--glass-border)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="var(--accent)" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.avatar}`}
                    alt={t.name}
                    className="w-10 h-10 rounded-full"
                    style={{ background: "var(--surface-2)", border: "2px solid var(--border)" }}
                  />
                  <div>
                    <p className="text-sm font-semibold font-display" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. FINAL CTA ═══ */}
      <section className="relative z-10 py-24 md:py-32 px-6">
        {/* Background decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "var(--accent)", opacity: 0.06 }} />
        </div>

        <div ref={ctaRef} className="scroll-reveal relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 font-display" style={{ color: "var(--text-primary)" }}>
            Ready to Unify Your{" "}
            <span className="gradient-text">Online Presence?</span>
          </h2>
          <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Join thousands of creators, developers, and designers who trust LinkHub to connect their audience with everything that matters.
          </p>
          <button
            id="final-cta"
            onClick={() => navigate("/login")}
            className="btn-shimmer animate-cta-glow px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-3 group"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
              color: "#fff",
            }}
          >
            Create Your LinkHub — Free
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <p className="mt-5 text-xs" style={{ color: "var(--text-tertiary)" }}>
            No credit card required · Free forever · Setup in 30 seconds
          </p>
        </div>
      </section>

      {/* ═══ 9. PREMIUM FOOTER ═══ */}
      <footer className="relative z-10 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2.5 justify-center md:justify-start mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dim))" }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <span className="text-lg font-bold font-display">
                  Link<span style={{ color: "var(--accent-bright)" }}>Hub</span>
                </span>
              </div>
              <p className="text-xs max-w-xs" style={{ color: "var(--text-tertiary)" }}>
                Your premium link-in-bio dashboard. Share everything that matters with a single, beautiful link.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-10 text-center md:text-left">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>Product</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigate("/login")} className="text-sm font-medium transition-colors bg-transparent border-none" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Get Started</button>
                  <button onClick={() => document.getElementById("dashboard-preview")?.scrollIntoView({ behavior: "smooth" })} className="text-sm font-medium transition-colors bg-transparent border-none" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Preview</button>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>Company</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigate("/about")} className="text-sm font-medium transition-colors bg-transparent border-none" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>About</button>
                  <button onClick={() => navigate("/login")} className="text-sm font-medium transition-colors bg-transparent border-none" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Sign In</button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="section-divider my-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              © {new Date().getFullYear()} LinkHub. Designed with <span style={{ color: "var(--accent)" }}>♥</span> by Nithin.
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)", opacity: 0.6 }}>
              Built with React + Firebase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
