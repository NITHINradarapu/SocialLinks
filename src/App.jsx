import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useLinks } from "./hooks/useLinks";
import { useProfile } from "./hooks/useProfile";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import LinkList from "./components/LinkList";
import ProfileHeader from "./components/ProfileHeader";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Route-level code splitting: only the dashboard shell is in the main bundle
const AddLink = lazy(() => import("./components/AddLink"));
const PublicProfile = lazy(() => import("./components/PublicProfile"));
const Login = lazy(() => import("./components/Login"));
const LandingPage = lazy(() => import("./components/LandingPage"));
const NotFound = lazy(() => import("./components/NotFound"));
const About = lazy(() => import("./components/About"));

function PageSpinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

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
        <div className="w-6 h-6 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isPublicProfile && user && (linksError || profileError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-md w-full p-6 rounded-2xl border card-quiet" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <h2 className="text-base font-medium mb-1.5 font-display" style={{ color: 'var(--text-primary)' }}>Failed to load dashboard data</h2>
          <p className="text-[13px] mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            There was a connection or server error while retrieving your profile details and link list.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full py-2 text-[13px]"
          >
            Reload page
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
        <Suspense fallback={<PageSpinner />}>
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
        </Suspense>
      </main>

      {!hideLayout && (
        <footer
          className="text-center pt-5 pb-20 sm:pb-24 text-[11px] font-mono-meta"
          style={{ color: "var(--text-tertiary)" }}
        >
          LinkHub · Personal directory
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
