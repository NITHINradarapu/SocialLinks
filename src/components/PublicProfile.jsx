import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileFromFirestore, getUidByUsername } from '../services/profileService';
import { getLinksFromFirestore } from '../services/linkService';
import { getPlatformIcon, getPlatformColor, getPlatformCategory } from '../utils/platformIcons';
import NotFound from './NotFound';

function PublicLinkCard({ link, index }) {
  const colors = getPlatformColor(link.platform);
  const icon = getPlatformIcon(link.platform);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group animate-fade-in-up block w-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.background = 'var(--surface-3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--surface-2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: colors.bg, color: colors.text }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-center group-hover:text-[var(--accent-bright)] transition-colors" style={{ color: 'var(--text-primary)' }}>
            {link.platform}
          </p>
        </div>
        <div className="w-12 h-12 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.text }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default function PublicProfile() {
  const { username, uid: uidParam } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let resolvedUid = uidParam;
        
        // If we have a username, resolve it to a UID
        if (username) {
          resolvedUid = await getUidByUsername(username);
        }
        
        if (!resolvedUid) {
          setError(true);
          setLoading(false);
          return;
        }

        const [profileData, linksData] = await Promise.all([
          getProfileFromFirestore(resolvedUid),
          getLinksFromFirestore(resolvedUid)
        ]);
        
        if (profileData) {
          setProfile(profileData);
        } else {
          setProfile({ name: 'User', bio: 'No bio provided', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=fallback' });
        }
        setLinks(linksData || []);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username, uidParam]);

  useEffect(() => {
    if (!profile) return;
    const defaultTitle = "Link Hub — Your Premium Link-in-Bio Dashboard";
    document.title = `${profile.name} (@${username || 'profile'}) | LinkHub`;
    return () => {
      document.title = defaultTitle;
    };
  }, [profile, username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    // Render the proper NotFound page — this handles the case where /:username
    // matches a path that isn't a real user (e.g. /faq, /settings, etc.)
    return <NotFound />;
  }

  const groupedLinks = links.reduce((acc, link) => {
    const category = link.category || getPlatformCategory(link.platform);
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {});

  // Predefined categories first, then custom ones, then 'Other' at the bottom
  const predefinedOrder = ['Portfolio', 'Coding', 'Social'];
  const categories = Object.keys(groupedLinks).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    const indexA = predefinedOrder.indexOf(a);
    const indexB = predefinedOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen py-16 px-5 sm:px-6 flex flex-col items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at top, var(--accent-dim) 0%, transparent 70%)' }} />

      <div className="w-full max-w-lg z-10">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center mb-10 animate-fade-in-up">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-xl" style={{ border: '3px solid var(--glass-border)' }}>
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{profile.name}</h1>
          <p className="text-[14px] max-w-xs" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-8 w-full">
          {categories.length > 0 ? (
            categories.map((category, catIndex) => (
              <div key={category} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 100}ms` }}>
                <h2 className="text-[12px] font-bold uppercase tracking-widest mb-3 pl-1" style={{ color: 'var(--text-tertiary)' }}>
                  {category}
                </h2>
                <div className="flex flex-col gap-3">
                  {groupedLinks[category].map((link, i) => (
                    <PublicLinkCard key={link.id} link={link} index={i} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>No links added yet.</p>
          )}
        </div>
      </div>
      
      <div className="mt-16 text-[11px] animate-fade-in-up" style={{ animationDelay: '500ms', color: 'var(--text-tertiary)' }}>
        Powered by <a href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>LinkHub</a>
      </div>
    </div>
  );
}
