import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, getPlatformCategory, getPlatformColor } from '../utils/platformIcons';
import { toast } from 'react-hot-toast';

export default function AddLink({ onAdd, links = [] }) {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const platformRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { platformRef.current?.focus(); }, []);

  const validateUrl = (str) => {
    try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
    catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p = platform.trim(), u = url.trim();
    if (!p) return toast.error('Enter a platform name.');
    if (!u) return toast.error('Enter a URL.');
    if (!validateUrl(u)) return toast.error('Enter a valid URL (e.g. https://github.com/user).');
    
    setIsSubmitting(true);
    try {
      await onAdd(p, u, category);
      setPlatform('');
      setUrl('');
      setCategory('Other');
      toast.success('Link added successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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

  // Progress indicator
  const step = !platform.trim() ? 0 : !url.trim() ? 1 : 2;

  return (
    <div className="flex justify-center animate-fade-in-up w-full">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-7">
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{
              background: 'var(--accent-glow)',
              border: '1px solid rgba(129,140,248,0.1)',
              boxShadow: '0 4px 16px var(--accent-glow)',
            }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-1 font-display" style={{ color: 'var(--text-primary)' }}>Add New Link</h1>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Save a profile link to access it anytime</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-5 px-1">
          {['Platform', 'URL', 'Submit'].map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full h-1 rounded-full transition-all duration-400"
                style={{
                  background: step >= i
                    ? 'linear-gradient(90deg, var(--accent), var(--accent-dim))'
                    : 'var(--surface-3)',
                  boxShadow: step >= i ? '0 0 8px var(--accent-glow)' : 'none',
                }}
              ></div>
              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{ color: step >= i ? 'var(--accent-bright)' : 'var(--text-tertiary)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(12px)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Presets */}
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
              Quick add
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => {
                const colors = getPlatformColor(p.name);
                const isSelected = platform === p.name;
                return (
                  <button
                    key={p.name}
                    id={`preset-${p.name.toLowerCase()}`}
                    type="button"
                    onClick={() => selectPreset(p)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all duration-200 active:scale-95"
                    style={{
                      background: isSelected ? colors.bg : 'var(--surface-2)',
                      color: isSelected ? colors.text : 'var(--text-secondary)',
                      border: `1px solid ${isSelected ? colors.border : 'var(--border)'}`,
                      opacity: isSubmitting ? 0.5 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: isSelected ? `0 2px 8px ${colors.bg}` : 'none',
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
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
                disabled={isSubmitting}
                placeholder="e.g., GitHub"
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'text' }}
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
                disabled={isSubmitting}
                placeholder="Select or type a category"
                className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all duration-200"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--border)',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text'
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
                disabled={isSubmitting}
                placeholder={presets.find(x => x.name === platform)?.ph || 'https://example.com/profile'}
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'text' }}
              />
            </div>


            {/* Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                id="add-link-submit"
                type="submit"
                disabled={isSubmitting}
                className="btn-shimmer flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                  color: '#fff',
                  border: 'none',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px var(--accent-glow)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Link
                  </>
                )}
              </button>
              <button
                id="add-link-cancel"
                type="button"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
            </div>

            <p className="text-center text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              Press <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-mono" style={{ background: 'var(--surface-2)', color: 'var(--accent-bright)', border: '1px solid var(--border)' }}>Enter</kbd> to submit
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
