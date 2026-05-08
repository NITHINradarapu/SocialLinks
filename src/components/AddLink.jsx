import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getPlatformCategory } from '../utils/platformIcons';
import { toast } from 'react-hot-toast';

export default function AddLink({ onAdd, links = [] }) {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Other');
  const platformRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { platformRef.current?.focus(); }, []);

  const validateUrl = (str) => {
    try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
    catch { return false; }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const p = platform.trim(), u = url.trim();
    if (!p) return toast.error('Enter a platform name.');
    if (!u) return toast.error('Enter a URL.');
    if (!validateUrl(u)) return toast.error('Enter a valid URL (e.g. https://github.com/user).');
    
    onAdd(p, u, category);
    setPlatform('');
    setUrl('');
    setCategory('Other');
    toast.success('Link added successfully!');
  };

  const presets = [
    { name: 'GitHub', ph: 'https://github.com/username' },
    { name: 'LinkedIn', ph: 'https://linkedin.com/in/username' },
    { name: 'LeetCode', ph: 'https://leetcode.com/username' },
    { name: 'Twitter', ph: 'https://x.com/username' },
    { name: 'Portfolio', ph: 'https://yoursite.com' },
  ];

  const selectPreset = (p) => {
    setPlatform(p.name);
    setCategory(getPlatformCategory(p.name));
    setUrl('');
    setTimeout(() => document.getElementById('url-input')?.focus(), 50);
  };

  return (
    <div className="flex justify-center animate-fade-in-up w-full">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-7">
          <div
            className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-glow)', border: '1px solid rgba(129,140,248,0.15)' }}
          >
            <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Add New Link</h1>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Save a profile link to access it anytime</p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-5 sm:p-6"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Presets */}
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
              Quick add
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.name}
                  id={`preset-${p.name.toLowerCase()}`}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className="px-3 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-all duration-150 active:scale-95"
                  style={{
                    background: platform === p.name ? 'var(--accent)' : 'var(--surface-2)',
                    color: platform === p.name ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${platform === p.name ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-5" style={{ borderTop: '1px solid var(--border)' }} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="platform-input" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Platform Name
              </label>
              <input
                ref={platformRef}
                id="platform-input"
                type="text"
                value={platform}
                onChange={(e) => { 
                  const val = e.target.value;
                  setPlatform(val); 
                  setCategory(getPlatformCategory(val));
                }}
                placeholder="e.g., GitHub"
              />
            </div>

            <div>
              <label htmlFor="category-input" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Category
              </label>
              <input
                id="category-input"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or type a category"
                className="w-full rounded-lg px-3 py-2 text-[13px] outline-none transition-all duration-200"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)'
                }}
              />
              <datalist id="category-suggestions">
                {[...new Set([...CATEGORIES.filter(c => c !== 'All'), ...links.map(l => l.category || getPlatformCategory(l.platform))])].map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="url-input" className="block text-[12.5px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                URL
              </label>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={presets.find(x => x.name === platform)?.ph || 'https://example.com/profile'}
              />
            </div>


            {/* Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                id="add-link-submit"
                type="submit"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                  color: '#fff',
                  border: 'none',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Link
              </button>
              <button
                id="add-link-cancel"
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                Cancel
              </button>
            </div>

            <p className="text-center text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              Press <kbd className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--surface-2)', color: 'var(--accent-bright)', border: '1px solid var(--border)' }}>Enter</kbd> to submit
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
