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
import { Toaster } from "react-hot-toast";

export default function App() {
  const { links, loadingLinks, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { profile, loadingProfile, updateProfile } = useProfile();
  const { mode, setMode, accentKey, setAccentKey } = useTheme();
  const { user, loading } = useAuth();

  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith("/p/");
  const isLoginPage = location.pathname === "/login";
  const isLandingPage = location.pathname === "/" && !user;
  const isKnownPath = ["/", "/add", "/login"].includes(location.pathname) || isPublicProfile;
  const hideLayout = isPublicProfile || isLoginPage || isLandingPage || !isKnownPath;

  if (loading || (!isPublicProfile && user && loadingLinks) || (!isPublicProfile && user && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
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
                <>
                  <ProfileHeader profile={profile} onUpdate={updateProfile} />
                  <LinkList
                    links={links}
                    onDelete={deleteLink}
                    onEdit={updateLink}
                    onReorder={reorderLinks}
                  />
                </>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/add"
            element={
              user ? (
                <AddLink onAdd={addLink} links={links} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/p/:uid" element={<PublicProfile />} />
          <Route path="/:username" element={<PublicProfile />} />
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
          setMode={setMode}
          accentKey={accentKey}
          setAccentKey={setAccentKey}
        />
      )}
    </div>
  );
}
