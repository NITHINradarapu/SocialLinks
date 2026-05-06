import { useState, useEffect } from 'react';

const THEME_KEY = 'linkhub_theme';
const ACCENT_KEY = 'linkhub_accent';

export const ACCENTS = {
  indigo: { name: 'Indigo', color: '#818cf8', dim: '#6366f1', glow: 'rgba(129, 140, 248, 0.18)', bright: '#a5b4fc' },
  emerald: { name: 'Emerald', color: '#34d399', dim: '#10b981', glow: 'rgba(52, 211, 153, 0.18)', bright: '#6ee7b7' },
  rose: { name: 'Rose', color: '#fb7185', dim: '#f43f5e', glow: 'rgba(251, 113, 133, 0.18)', bright: '#fda4af' },
  amber: { name: 'Amber', color: '#fbbf24', dim: '#f59e0b', glow: 'rgba(251, 191, 36, 0.18)', bright: '#fcd34d' },
  cyan: { name: 'Cyan', color: '#22d3ee', dim: '#06b6d4', glow: 'rgba(34, 211, 238, 0.18)', bright: '#67e8f9' },
};

export function useTheme() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; }
    catch { return 'dark'; }
  });

  const [accentKey, setAccentKey] = useState(() => {
    try { return localStorage.getItem(ACCENT_KEY) || 'indigo'; }
    catch { return 'indigo'; }
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    
    const accent = ACCENTS[accentKey] || ACCENTS.indigo;
    root.style.setProperty('--accent', accent.color);
    root.style.setProperty('--accent-dim', accent.dim);
    root.style.setProperty('--accent-glow', accent.glow);
    root.style.setProperty('--accent-bright', accent.bright);
    
    try {
      localStorage.setItem(THEME_KEY, mode);
      localStorage.setItem(ACCENT_KEY, accentKey);
    } catch {
      // Ignore
    }
  }, [mode, accentKey]);

  return {
    mode,
    setMode,
    accentKey,
    setAccentKey
  };
}
