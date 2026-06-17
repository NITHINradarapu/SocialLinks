import { useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '../services/authService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ linkCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-2xl transition-all duration-300"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 h-[56px] flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group cursor-pointer bg-transparent border-none"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
              boxShadow: '0 2px 8px var(--accent-glow)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
            Link<span className="transition-colors duration-200" style={{ color: 'var(--accent-bright)' }}>Hub</span>
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-2">
          {linkCount > 0 && (
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent-bright)',
                border: '1px solid rgba(129,140,248,0.1)',
              }}
            >
              {linkCount}
            </span>
          )}

          {/* Separator */}
          {linkCount > 0 && (
            <div className="w-px h-5 mx-0.5" style={{ background: 'var(--border)' }}></div>
          )}

          {isHome ? (
            <button
              id="nav-add-link"
              onClick={() => navigate('/add')}
              className="btn-shimmer flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px var(--accent-glow)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:block">Add Link</span>
            </button>
          ) : (
            <button
              id="nav-back"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 active:scale-95 group"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.background = 'var(--surface-3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--surface-2)';
              }}
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:block">Dashboard</span>
            </button>
          )}

          <button
            onClick={() => navigate('/about')}
            className="flex items-center justify-center p-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--surface-3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.background = 'transparent';
            }}
            title="About Developer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Logout Button */}
          {user && (
            <button
              onClick={async () => {
                try {
                  await logOut();
                  navigate('/login');
                  toast.success('Logged out successfully');
                } catch (error) {
                  console.error("Logout failed:", error);
                  toast.error('Failed to log out. Please try again.');
                }
              }}
              className="flex items-center justify-center p-2 rounded-lg transition-all duration-200"
              title="Log Out"
              style={{ color: 'var(--danger)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--danger-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
