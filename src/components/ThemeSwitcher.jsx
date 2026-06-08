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
          className="absolute bottom-14 right-0 w-56 sm:w-64 p-3.5 sm:p-4 rounded-2xl shadow-xl animate-fade-in-up"
          style={{ 
            background: 'var(--surface-1)', 
            border: '1px solid var(--border)',
            transformOrigin: 'bottom right' 
          }}
        >
          {/* Mode Toggle */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Appearance
            </p>
            <div className="flex p-1 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              <button
                onClick={() => setMode('light')}
                className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[12px] font-medium transition-all"
                style={{ 
                  background: mode === 'light' ? 'var(--surface-1)' : 'transparent',
                  color: mode === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: mode === 'light' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </button>
              <button
                onClick={() => setMode('dark')}
                className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[12px] font-medium transition-all"
                style={{ 
                  background: mode === 'dark' ? 'var(--surface-1)' : 'transparent',
                  color: mode === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
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
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Accent Color
            </p>
            <div className="flex gap-2">
              {Object.entries(ACCENTS).map(([key, accent]) => (
                <button
                  key={key}
                  onClick={() => setAccentKey(key)}
                  className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center cursor-pointer bg-transparent"
                  style={{ 
                    borderColor: accentKey === key ? accent.color : 'transparent'
                  }}
                  title={accent.name}
                >
                  <div 
                    className="w-5.5 h-5.5 rounded-full flex items-center justify-center transition-transform" 
                    style={{ backgroundColor: accent.color }}
                  >
                    {accentKey === key && (
                      <svg className="w-3.5 h-3.5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ 
          background: 'var(--surface-2)', 
          border: '1px solid var(--border)',
          color: 'var(--text-primary)'
        }}
        aria-label="Theme settings"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
    </div>
  );
}
