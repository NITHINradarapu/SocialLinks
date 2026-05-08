import { useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '../services/authService';

export default function Navbar({ linkCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-2xl"
      style={{
        background: 'rgba(10, 14, 26, 0.75)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group cursor-pointer bg-transparent border-none"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Link<span style={{ color: 'var(--accent-bright)' }}>Hub</span>
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {linkCount > 0 && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent-bright)' }}
            >
              {linkCount}
            </span>
          )}

          {isHome ? (
            <button
              id="nav-add-link"
              onClick={() => navigate('/add')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                color: '#fff',
                border: 'none',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Link
            </button>
          ) : (
            <button
              id="nav-back"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={async () => {
              await logOut();
              navigate('/login');
            }}
            className="flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors duration-200"
            title="Log Out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
