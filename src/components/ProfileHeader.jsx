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
  const [copied, setCopied] = useState(false);
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
      
      if (cleanUsername.length < 3 || cleanUsername.length > 30) {
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
        toast.error('Error checking username availability');
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
      toast.success('Profile saved');
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
      setCopied(true);
      toast.success('Public link copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy link automatically');
    }
  };

  if (editing) {
    return (
      <div
        className="mb-6 p-5 sm:p-6 rounded-2xl animate-fade-in card-quiet"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Avatar</label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_AVATARS.map((av) => (
                <button
                  key={av.name}
                  onClick={() => setEditAvatar(av.url)}
                  disabled={saving}
                  className="w-11 h-11 rounded-full border transition-colors"
                  style={{ 
                    borderColor: editAvatar === av.url ? 'var(--text-primary)' : 'var(--border)',
                    background: 'var(--surface-2)',
                    padding: '2px',
                    opacity: saving ? 0.5 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  <img src={av.url} alt={av.name} className="w-full h-full rounded-full" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Display name</label>
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              maxLength={100}
              onChange={(e) => setEditName(e.target.value)}
              disabled={saving}
              placeholder="Your name"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Bio</label>
            <input
              type="text"
              value={editBio}
              maxLength={1000}
              onChange={(e) => setEditBio(e.target.value)}
              disabled={saving}
              placeholder="Short bio"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium mb-1.5 flex items-center justify-between uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              <span>Username slug</span>
              {usernameStatus === 'loading' && <span className="font-mono-meta text-[10px] normal-case">Checking...</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                disabled={saving}
                placeholder="username"
                maxLength={30}
                className={`w-full pr-8 ${
                  usernameStatus === 'available' ? 'border-[var(--success)]' : 
                  usernameStatus === 'unavailable' || usernameStatus === 'invalid' || usernameStatus === 'error' ? 'border-[var(--danger)]' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                {usernameStatus === 'available' && (
                  <svg className="w-4 h-4 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {(usernameStatus === 'unavailable' || usernameStatus === 'invalid' || usernameStatus === 'error') && (
                  <svg className="w-4 h-4 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            {usernameStatus !== 'idle' && usernameStatus !== 'loading' && (
              <p className={`text-[11px] mt-1 font-medium ${
                usernameStatus === 'available' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
              }`}>
                {usernameStatus === 'available' && 'Username is available'}
                {usernameStatus === 'unavailable' && 'Username is already taken'}
                {usernameStatus === 'invalid' && 'Must be 3–30 characters (letters, numbers, underscores)'}
                {usernameStatus === 'error' && 'Error validating username'}
              </p>
            )}
            <p className="text-[11px] mt-1 text-[var(--text-tertiary)] font-mono-meta">
              Public URL: {window.location.origin}/{editUsername || 'username'}
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditSave}
              disabled={saving}
              className="btn-primary flex-1 py-2 text-[13px] flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : 'Save profile'}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="btn-ghost px-4 py-2 text-[13px]"
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
      className="mb-6 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4.5 animate-fade-in card-quiet"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Avatar with clean hairline ring */}
      <div className="relative shrink-0">
        <div
          className="w-18 h-18 rounded-full border overflow-hidden p-0.5"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface-2)',
          }}
        >
          <img src={profile.avatar} alt="Profile Avatar" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
      
      <div className="flex-1 text-center sm:text-left min-w-0">
        <h2 className="text-lg font-medium truncate font-display" style={{ color: 'var(--text-primary)' }}>
          {profile.name}
        </h2>
        <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {profile.bio}
        </p>
        
        {/* Public Link Preview */}
        <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5 font-mono-meta text-[11px]">
          <span style={{ color: 'var(--text-tertiary)' }}>Public URL:</span>
          <a 
            href={profile.username ? `/${profile.username}` : `/p/${user?.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline truncate block max-w-[200px] sm:max-w-none"
            style={{ color: 'var(--accent)' }}
          >
            {window.location.host}{profile.username ? `/${profile.username}` : `/p/${user?.uid?.slice(0, 8)}...`}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleEditStart}
          className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-[12.5px]"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </button>
        
        <button
          onClick={handleShare}
          className="btn-accent-ghost flex items-center gap-1.5 px-3 py-1.5 text-[12.5px]"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
