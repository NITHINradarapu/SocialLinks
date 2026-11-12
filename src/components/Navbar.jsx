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
      className="sticky top-0 z-50 transition-colors"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none text-left"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center border"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-[14px] font-medium tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
            LinkHub
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-2">
          {linkCount > 0 && (
            <span
              className="text-[11px] font-mono-meta px-2 py-0.5 rounded-md border"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                borderColor: 'var(--border)',
              }}
            >
              {linkCount}
            </span>
          )}

          {isHome ? (
            <button
              id="nav-add-link"
              onClick={() => navigate('/add')}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-[12.5px]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add link</span>
            </button>
          ) : (
            <button
              id="nav-back"
              onClick={() => navigate('/')}
              className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-[12.5px]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Dashboard</span>
            </button>
          )}

          <button
            id="nav-about"
            onClick={() => navigate('/about')}
            className="btn-icon p-1.5"
            title="About Developer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Logout Button */}
          {user && (
            <button
              id="nav-logout"
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
              className="btn-icon-danger p-1.5"
              title="Log Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
