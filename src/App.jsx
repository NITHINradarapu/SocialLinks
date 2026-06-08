import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useLinks } from "./hooks/useLinks";
import { useProfile } from "./hooks/useProfile";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import LinkList from "./components/LinkList";
import AddLink from "./components/AddLink";
import ProfileHeader from "./components/ProfileHeader";
import PublicProfile from "./components/PublicProfile";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import NotFound from "./components/NotFound";
import About from "./components/About";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { links, loadingLinks, linksError, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { profile, loadingProfile, profileError, updateProfile } = useProfile();
  const { mode, setMode, accentKey, setAccentKey } = useTheme();
  const { user, loading } = useAuth();

  // Sync Firestore profile theme settings to local state on load
  useEffect(() => {
    if (profile && !loadingProfile) {
      if (profile.themeMode && profile.themeMode !== mode) {
        setMode(profile.themeMode);
      }
      if (profile.themeAccent && profile.themeAccent !== accentKey) {
        setAccentKey(profile.themeAccent);
      }
    }
  }, [profile, loadingProfile, mode, accentKey, setMode, setAccentKey]);

  const handleSetMode = async (newMode) => {
    setMode(newMode);
    if (user && profile && !loadingProfile) {
      try {
        await updateProfile({ themeMode: newMode });
      } catch (err) {
        console.error("Failed to sync theme mode to Firestore:", err);
      }
    }
  };

  const handleSetAccentKey = async (newAccentKey) => {
    setAccentKey(newAccentKey);
    if (user && profile && !loadingProfile) {
      try {
        await updateProfile({ themeAccent: newAccentKey });
      } catch (err) {
        console.error("Failed to sync theme accent to Firestore:", err);
      }
    }
  };

  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith("/p/");
  const isLoginPage = location.pathname === "/login";
  const isLandingPage = location.pathname === "/" && !user;
  const isKnownPath = ["/", "/add", "/login", "/about"].includes(location.pathname) || isPublicProfile;
  const hideLayout = isPublicProfile || isLoginPage || isLandingPage || !isKnownPath;

  if (loading || (!isPublicProfile && user && loadingLinks) || (!isPublicProfile && user && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isPublicProfile && user && (linksError || profileError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in" style={{ background: 'var(--surface-1)' }}>
        <div className="max-w-md w-full p-8 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2.5" style={{ color: 'var(--text-primary)' }}>Failed to load dashboard data</h2>
          <p className="text-[13px] mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            There was a connection or server error while retrieving your profile details and link list. Please try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', color: '#fff' }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--surface-2)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: '13px',
            borderRadius: '12px'
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--surface-2)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger)',
              secondary: 'var(--surface-2)',
            },
          },
        }}
      />
      {!hideLayout && <Navbar linkCount={links.length} />}
      <main
        className={`flex-1 w-full ${hideLayout ? "" : "max-w-2xl mx-auto px-5 sm:px-6 py-8"}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <ProtectedRoute>
                  <ProfileHeader profile={profile} onUpdate={updateProfile} />
                  <LinkList
                    links={links}
                    onDelete={deleteLink}
                    onEdit={updateLink}
                    onReorder={reorderLinks}
                  />
                </ProtectedRoute>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddLink onAdd={addLink} links={links} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/p/:uid" element={<PublicProfile />} />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && (
        <footer
          className="text-center py-5 text-[11px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Built with <span style={{ color: "var(--accent)" }}>♥</span> — LinkHub
        </footer>
      )}

      {!hideLayout && (
        <ThemeSwitcher
          mode={mode}
          setMode={handleSetMode}
          accentKey={accentKey}
          setAccentKey={handleSetAccentKey}
        />
      )}
    </div>
  );
}
