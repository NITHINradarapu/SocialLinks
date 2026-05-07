import { Routes, Route, useLocation } from "react-router-dom";
import { useLinks } from "./hooks/useLinks";
import { useProfile } from "./hooks/useProfile";
import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import LinkList from "./components/LinkList";
import AddLink from "./components/AddLink";
import ProfileHeader from "./components/ProfileHeader";
import PublicProfile from "./components/PublicProfile";
import ThemeSwitcher from "./components/ThemeSwitcher";

export default function App() {
  const { links, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { profile, updateProfile } = useProfile();
  const { mode, setMode, accentKey, setAccentKey } = useTheme();
  
  const location = useLocation();
  const isPublicProfile = location.pathname === '/profile';

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isPublicProfile && <Navbar linkCount={links.length} />}
      <main className={`flex-1 w-full ${isPublicProfile ? '' : 'max-w-2xl mx-auto px-5 sm:px-6 py-8'}`}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProfileHeader profile={profile} onUpdate={updateProfile} />
                <LinkList links={links} onDelete={deleteLink} onEdit={updateLink} onReorder={reorderLinks} />
              </>
            }
          />
          <Route path="/add" element={<AddLink onAdd={addLink} links={links} />} />
          <Route path="/profile" element={<PublicProfile />} />
        </Routes>
      </main>
      
      {!isPublicProfile && (
        <footer
          className="text-center py-5 text-[11px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Built with <span style={{ color: "var(--accent)" }}>♥</span> — LinkHub
        </footer>
      )}
      
      {!isPublicProfile && (
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
