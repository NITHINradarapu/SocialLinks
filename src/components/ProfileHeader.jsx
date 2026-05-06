import { useState, useRef, useEffect } from 'react';

const PREDEFINED_AVATARS = [
  { name: 'Felix', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix' },
  { name: 'Aneka', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka' },
  { name: 'Bear', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bear' },
  { name: 'Jasper', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jasper' },
  { name: 'Mimi', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mimi' },
  { name: 'Scooter', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Scooter' }
];

export default function ProfileHeader({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editing) nameInputRef.current?.focus();
  }, [editing]);

  const handleEditStart = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatar);
    setEditing(true);
  };

  const handleEditSave = () => {
    onUpdate({ name: editName.trim(), bio: editBio.trim(), avatar: editAvatar });
    setEditing(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Public profile link copied to clipboard!');
    } catch {
      alert(`Could not copy automatically. Here is your link:\n${url}`);
    }
  };

  if (editing) {
    return (
      <div className="mb-8 p-5 sm:p-6 rounded-2xl animate-fade-in-up" style={{ background: 'var(--surface-1)', border: '1px solid var(--accent)', boxShadow: '0 0 0 3px var(--accent-glow)' }}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Avatar</label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_AVATARS.map((av) => (
                <button
                  key={av.name}
                  onClick={() => setEditAvatar(av.url)}
                  className="w-12 h-12 rounded-full border-2 transition-all"
                  style={{ 
                    borderColor: editAvatar === av.url ? 'var(--accent)' : 'transparent',
                    background: 'var(--surface-2)',
                    padding: '2px'
                  }}
                >
                  <img src={av.url} alt={av.name} className="w-full h-full rounded-full" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Display Name</label>
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your Name"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Bio</label>
            <input
              type="text"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Short bio..."
              className="w-full"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditSave}
              className="flex-1 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', color: '#fff' }}
            >
              Save Profile
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200"
              style={{ background: 'var(--surface-3)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up transition-all duration-300"
         style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}>
      <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)', border: '2px solid var(--glass-border)' }}>
        <img src={profile.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 text-center sm:text-left min-w-0">
        <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{profile.name}</h2>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleEditStart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all duration-150 hover:bg-[var(--surface-3)]"
          style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all duration-150 hover:brightness-110"
          style={{ background: 'var(--accent-glow)', color: 'var(--accent-bright)', border: '1px solid rgba(129,140,248,0.15)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
