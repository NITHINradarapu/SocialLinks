import { useState, useEffect } from 'react';

const THEME_KEY = 'linkhub_theme';
const ACCENT_KEY = 'linkhub_accent';

export const ACCENTS = {
  indigo: { name: 'Indigo', color: '#6366f1', dim: '#4f46e5', glow: 'rgba(99, 102, 241, 0.12)', bright: '#818cf8' },
  emerald: { name: 'Emerald', color: '#10b981', dim: '#059669', glow: 'rgba(16, 185, 129, 0.12)', bright: '#34d399' },
  rose: { name: 'Rose', color: '#e11d48', dim: '#be123c', glow: 'rgba(225, 29, 72, 0.12)', bright: '#fb7185' },
  amber: { name: 'Amber', color: '#d97706', dim: '#b45309', glow: 'rgba(217, 119, 6, 0.12)', bright: '#f59e0b' },
  cyan: { name: 'Cobalt', color: '#0284c7', dim: '#0369a1', glow: 'rgba(2, 132, 199, 0.12)', bright: '#38bdf8' },
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
