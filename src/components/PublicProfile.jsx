import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileFromFirestore, getUidByUsername } from '../services/profileService';
import { getLinksFromFirestore } from '../services/linkService';
import { getPlatformIcon, getPlatformColor, getPlatformCategory, getSafeUrl } from '../utils/platformIcons';
import NotFound from './NotFound';

function PublicLinkCard({ link, index }) {
  const colors = getPlatformColor(link.platform);
  const icon = getPlatformIcon(link.platform);

  return (
    <a
      href={getSafeUrl(link.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="group animate-fade-in-up block w-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.background = 'var(--surface-3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `var(--shadow-md), 0 0 20px ${colors.bg}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--surface-2)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
      >
        {/* Platform color accent bar */}
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: colors.text }}
        ></div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ background: colors.bg, color: colors.text }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-left group-hover:text-[var(--accent-bright)] transition-colors" style={{ color: 'var(--text-primary)' }}>
            {link.platform}
          </p>
        </div>
        <div className="w-10 h-10 shrink-0 flex items-center justify-center opacity-40 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" style={{ color: colors.text }}>
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
    const ACCENTS = {
      indigo: { color: '#818cf8', dim: '#6366f1', glow: 'rgba(129, 140, 248, 0.18)', bright: '#a5b4fc' },
      emerald: { color: '#34d399', dim: '#10b981', glow: 'rgba(52, 211, 153, 0.18)', bright: '#6ee7b7' },
      rose: { color: '#fb7185', dim: '#f43f5e', glow: 'rgba(251, 113, 133, 0.18)', bright: '#fda4af' },
      amber: { color: '#fbbf24', dim: '#f59e0b', glow: 'rgba(251, 191, 36, 0.18)', bright: '#fcd34d' },
      cyan: { color: '#22d3ee', dim: '#06b6d4', glow: 'rgba(34, 211, 238, 0.18)', bright: '#67e8f9' },
    };
    
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
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen py-16 px-5 sm:px-6 flex flex-col items-center relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, var(--accent-dim) 0%, transparent 70%)' }}
      />
      {/* Secondary glow */}
      <div
        className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ background: 'var(--accent)' }}
      />

      <div className="w-full max-w-lg z-10">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center mb-12 animate-fade-in-up">
          {/* Avatar with gradient ring */}
          <div
            className="w-28 h-28 rounded-full p-[3px] mb-5"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim), var(--accent-bright))',
              boxShadow: '0 8px 32px var(--accent-glow)',
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>{profile.name}</h1>
          <p className="text-[14px] max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-8 w-full">
          {categories.length > 0 ? (
            categories.map((category, catIndex) => (
              <div key={category} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 100}ms` }}>
                <div className="flex items-center gap-2 mb-3 pl-1">
                  <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent-dim))' }}></div>
                  <h2 className="text-[12px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                    {category}
                  </h2>
                </div>
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
      
      <div className="mt-16 text-[11px] animate-fade-in-up flex items-center gap-1.5" style={{ animationDelay: '500ms', color: 'var(--text-tertiary)' }}>
        Powered by{' '}
        <a href="/" className="hover:underline font-medium inline-flex items-center gap-1" style={{ color: 'var(--accent)' }}>
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          LinkHub
        </a>
      </div>
    </div>
  );
}
