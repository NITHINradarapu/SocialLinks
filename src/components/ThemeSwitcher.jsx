import { useState, useRef, useEffect } from 'react';
import { ACCENTS } from '../hooks/useTheme';

export default function ThemeSwitcher({ mode, setMode, accentKey, setAccentKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50" ref={menuRef}>
      {/* Menu Panel */}
      {isOpen && (
        <div 
          className="absolute bottom-14 right-0 w-64 p-4 rounded-xl animate-fade-in shadow-lg"
          style={{ 
            background: 'var(--surface-1)', 
            border: '1px solid var(--border)',
          }}
        >
          {/* Mode Toggle */}
          <div className="mb-4">
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Appearance
            </p>
            <div className="flex p-0.5 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setMode('light')}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[12px] font-medium transition-colors"
                style={{ 
                  background: mode === 'light' ? 'var(--surface-1)' : 'transparent',
                  color: mode === 'light' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: mode === 'light' ? 'var(--shadow-xs)' : 'none',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </button>
              <button
                onClick={() => setMode('dark')}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[12px] font-medium transition-colors"
                style={{ 
                  background: mode === 'dark' ? 'var(--surface-1)' : 'transparent',
                  color: mode === 'dark' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: mode === 'dark' ? 'var(--shadow-xs)' : 'none',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark
              </button>
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Accent
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.entries(ACCENTS).map(([key, accent]) => (
                <button
                  key={key}
                  onClick={() => setAccentKey(key)}
                  className="flex flex-col items-center gap-1 p-1 rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                  title={accent.name}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center border"
                    style={{ 
                      borderColor: accentKey === key ? 'var(--text-primary)' : 'transparent',
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: accent.color }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-normal"
                    style={{ color: accentKey === key ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                  >
                    {accent.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors shadow-sm"
        style={{ 
          background: 'var(--surface-1)', 
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
        aria-label="Theme settings"
      >
        <svg
          className="w-4 h-4"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
    </div>
  );
}
