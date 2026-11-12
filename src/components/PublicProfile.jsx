import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileFromFirestore, getUidByUsername } from '../services/profileService';
import { getLinksFromFirestore } from '../services/linkService';
import { getPlatformIcon, getPlatformColor, getPlatformCategory, getSafeUrl } from '../utils/platformIcons';
import { ACCENTS } from '../hooks/useTheme';
import NotFound from './NotFound';

function PublicLinkCard({ link, index }) {
  const colors = getPlatformColor(link.platform);
  const icon = getPlatformIcon(link.platform);

  return (
    <a
      href={getSafeUrl(link.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl border transition-colors card-quiet"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center border shrink-0"
          style={{ 
            background: 'var(--surface-2)', 
            borderColor: 'var(--border)',
            color: colors.text 
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-medium leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {link.platform}
          </p>
        </div>
        <div className="w-6 h-6 shrink-0 flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
          setProfile({ name: 'User', bio: '', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=fallback' });
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
    const defaultTitle = "LinkHub — Directory";
    document.title = `${profile.name} (@${username || 'profile'}) | LinkHub`;
    return () => {
      document.title = defaultTitle;
    };
  }, [profile, username]);

  useEffect(() => {
    if (!profile) return;
    
    const root = document.documentElement;
    const originalMode = root.getAttribute('data-theme') || 'dark';
    const originalAccent = root.style.getPropertyValue('--accent');
    const originalAccentDim = root.style.getPropertyValue('--accent-dim');
    const originalAccentGlow = root.style.getPropertyValue('--accent-glow');
    const originalAccentBright = root.style.getPropertyValue('--accent-bright');
    
    const themeMode = profile.themeMode || 'dark';
    const themeAccent = profile.themeAccent || 'indigo';
    
    const accent = ACCENTS[themeAccent] || ACCENTS.indigo;
    
    root.setAttribute('data-theme', themeMode);
    root.style.setProperty('--accent', accent.color);
    root.style.setProperty('--accent-dim', accent.dim);
    root.style.setProperty('--accent-glow', accent.glow);
    root.style.setProperty('--accent-bright', accent.bright);
    
    return () => {
      root.setAttribute('data-theme', originalMode);
      if (originalAccent) root.style.setProperty('--accent', originalAccent);
      if (originalAccentDim) root.style.setProperty('--accent-dim', originalAccentDim);
      if (originalAccentGlow) root.style.setProperty('--accent-glow', originalAccentGlow);
      if (originalAccentBright) root.style.setProperty('--accent-bright', originalAccentBright);
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  const groupedLinks = links.reduce((acc, link) => {
    const category = link.category || getPlatformCategory(link.platform);
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {});

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
    <div className="min-h-screen py-16 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
          {/* Avatar with hairline border */}
          <div
            className="w-20 h-20 rounded-full border overflow-hidden p-0.5 mb-3.5"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface-2)',
            }}
          >
            <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <h1 className="text-xl font-medium mb-1 font-display" style={{ color: 'var(--text-primary)' }}>
            {profile.name}
          </h1>
          {profile.bio && (
            <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links Grouped by Category */}
        <div className="flex flex-col gap-6 w-full">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <h2 className="text-[11px] font-mono-meta font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    {category}
                  </h2>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div>
                </div>
                <div className="flex flex-col gap-2">
                  {groupedLinks[category].map((link, i) => (
                    <PublicLinkCard key={link.id} link={link} index={i} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
              No links added yet
            </p>
          )}
        </div>

        {/* Quiet Footer */}
        <div className="mt-12 text-center text-[11px] font-mono-meta flex items-center justify-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
          <span>LinkHub</span>
          <span>·</span>
          <a href="/" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
            Create your own
          </a>
        </div>
      </div>
    </div>
  );
}
