import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { checkUsernameAvailability, claimUsername, RESERVED_USERNAMES } from '../services/profileService';

const PREDEFINED_AVATARS = [
  { name: 'Felix', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix' },
  { name: 'Aneka', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka' },
  { name: 'Bear', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bear' },
  { name: 'Jasper', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jasper' },
  { name: 'Mimi', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mimi' },
  { name: 'Scooter', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Scooter' },
  { name: 'Mia', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Mia' },
  { name: 'Sophie', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophie' },
  { name: 'Chloe', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe' },
  { name: 'Zoey', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Zoey' },
  { name: 'Lily', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Lily' },
  { name: 'Daisy', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Daisy' }
];

export default function ProfileHeader({ profile, onUpdate }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [editUsername, setEditUsername] = useState(profile.username || '');
  const [usernameStatus, setUsernameStatus] = useState('idle'); // 'idle', 'loading', 'available', 'unavailable', 'invalid'
  const [shareAnimating, setShareAnimating] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editing) nameInputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (!editing) return;

    const cleanUsername = editUsername.trim().toLowerCase();

    const check = async () => {
      if (cleanUsername === '') {
        setUsernameStatus('available');
        return;
      }

      if (cleanUsername === (profile.username || '').toLowerCase()) {
        setUsernameStatus('idle');
        return;
      }
      
      if (cleanUsername.length < 3) {
        setUsernameStatus('invalid');
        return;
      }
      
      if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
        setUsernameStatus('invalid');
        return;
      }
      
      if (RESERVED_USERNAMES.includes(cleanUsername)) {
        setUsernameStatus('unavailable');
        return;
      }

      setUsernameStatus('loading');
      try {
        const available = await checkUsernameAvailability(cleanUsername);
        setUsernameStatus(available ? 'available' : 'unavailable');
      } catch (err) {
        console.error("Error checking username availability:", err);
        setUsernameStatus('error');
        toast.error('Error checking username availability. Check your Firestore rules.');
      }
    };

    const timer = setTimeout(check, cleanUsername === '' ? 0 : 500);
    return () => clearTimeout(timer);
  }, [editUsername, editing, profile.username]);

  const handleEditStart = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatar);
    setEditUsername(profile.username || '');
    setUsernameStatus('idle');
    setSaving(false);
    setEditing(true);
  };

  const handleEditSave = async () => {
    const cleanUsername = editUsername.trim().toLowerCase();
    
    // Validate username if changed
    if (cleanUsername !== (profile.username || '').toLowerCase()) {
      if (usernameStatus !== 'available') {
        toast.error('Please choose a valid and available username');
        return;
      }
      setSaving(true);
      try {
        await claimUsername(user.uid, cleanUsername, profile.username);
      } catch (err) {
        console.error("Failed to claim username:", err);
        toast.error('Failed to claim username');
        setSaving(false);
        return;
      }
    } else {
      setSaving(true);
    }

    try {
      await onUpdate({ 
        name: editName.trim(), 
        bio: editBio.trim(), 
        avatar: editAvatar,
        username: cleanUsername || null 
      });
      setEditing(false);
      toast.success('Profile saved!');
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!user) return;
    const url = profile.username 
      ? `${window.location.origin}/${profile.username}`
      : `${window.location.origin}/p/${user.uid}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareAnimating(true);
      toast.success('Public link copied to clipboard!');
      setTimeout(() => setShareAnimating(false), 1500);
    } catch {
      toast.error('Could not copy link automatically.');
    }
  };

  if (editing) {
    return (
      <div
        className="mb-8 p-5 sm:p-6 rounded-2xl animate-scale-in"
        style={{
          background: 'var(--glass)',
          border: '1px solid var(--accent)',
          boxShadow: '0 0 0 3px var(--accent-glow), var(--shadow-lg)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Avatar</label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_AVATARS.map((av) => (
                <button
                  key={av.name}
                  onClick={() => setEditAvatar(av.url)}
                  disabled={saving}
                  className="w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110"
                  style={{ 
                    borderColor: editAvatar === av.url ? 'var(--accent)' : 'transparent',
                    background: 'var(--surface-2)',
                    padding: '2px',
                    opacity: saving ? 0.5 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: editAvatar === av.url ? '0 0 12px var(--accent-glow)' : 'none',
                  }}
                >
                  <img src={av.url} alt={av.name} className="w-full h-full rounded-full" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold mb-1 block uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Display Name</label>
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={saving}
              placeholder="Your Name"
              className="w-full"
              style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'text' }}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold mb-1 block uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Bio</label>
            <input
              type="text"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              disabled={saving}
              placeholder="Short bio..."
              className="w-full"
              style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'text' }}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold mb-1 flex items-center gap-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              Username 
              <span 
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider normal-case"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '0.5px solid rgba(245, 158, 11, 0.3)' }}
                title="This feature is in experimental phase and may contain bugs."
              >
                <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Experimental
              </span>
              {usernameStatus === 'loading' && <span className="animate-pulse">...</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                disabled={saving}
                placeholder="username"
                className={`w-full pr-10 ${
                  usernameStatus === 'available' ? 'border-green-500/50' : 
                  usernameStatus === 'unavailable' || usernameStatus === 'invalid' || usernameStatus === 'error' ? 'border-red-500/50' : ''
                }`}
                style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'text' }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {usernameStatus === 'available' && (
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {(usernameStatus === 'unavailable' || usernameStatus === 'invalid' || usernameStatus === 'error') && (
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
            </div>
            {usernameStatus !== 'idle' && usernameStatus !== 'loading' && (
              <p className={`text-[10px] mt-1 font-semibold ${
                usernameStatus === 'available' ? 'text-green-500' : 'text-red-500'
              }`}>
                {usernameStatus === 'available' && 'Username is available!'}
                {usernameStatus === 'unavailable' && 'Username is already taken.'}
                {usernameStatus === 'invalid' && 'Username must be at least 3 characters and contain only letters, numbers, or underscores.'}
                {usernameStatus === 'error' && 'Error validating username.'}
              </p>
            )}
            <p className="text-[10px] mt-1.5 text-[var(--text-tertiary)]">
              Your profile will be at: <span className="text-[var(--accent)]">{window.location.origin}/{editUsername || 'username'}</span>
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditSave}
              disabled={saving}
              className="btn-shimmer flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', 
                color: '#fff',
                opacity: saving ? 0.7 : 1,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : 'Save Profile'}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200"
              style={{ 
                background: 'var(--surface-3)', 
                color: 'var(--text-secondary)',
                opacity: saving ? 0.5 : 1,
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mb-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up transition-all duration-300"
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Avatar with gradient ring */}
      <div className="relative shrink-0">
        <div
          className="w-20 h-20 rounded-full p-[3px]"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dim), var(--accent-bright))',
            boxShadow: '0 4px 16px var(--accent-glow)',
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
            <img src={profile.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        {/* Online indicator */}
        <div
          className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2"
          style={{
            background: 'var(--success)',
            borderColor: 'var(--surface-1)',
            boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)',
          }}
        ></div>
      </div>
      
      <div className="flex-1 text-center sm:text-left min-w-0">
        <h2 className="text-xl font-bold truncate font-display" style={{ color: 'var(--text-primary)' }}>{profile.name}</h2>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
        
        {/* Public Link Preview */}
        <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Public Link:</span>
          <a 
            href={profile.username ? `/${profile.username}` : `/p/${user?.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-medium hover:underline transition-colors truncate block max-w-[180px] xs:max-w-[240px] sm:max-w-none"
            style={{ color: 'var(--accent)' }}
          >
            {window.location.host}{profile.username ? `/${profile.username}` : `/p/${user?.uid?.slice(0, 8)}...`}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleEditStart}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95"
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
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all duration-200 active:scale-95"
          style={{
            background: 'var(--accent-glow)',
            color: 'var(--accent-bright)',
            border: '1px solid rgba(129,140,248,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {shareAnimating ? (
            <>
              <svg className="w-3.5 h-3.5 animate-copied-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </div>
  );
}
